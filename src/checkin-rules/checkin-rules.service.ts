import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCheckinRulesDto, CheckinRuleDto } from './dto';

/**
 * Interface para representar um conflito de janela entre regras.
 */
interface WindowConflict {
  regraA: string;
  regraB: string;
  mensagem: string;
}

@Injectable()
export class CheckinRulesService {
  private readonly logger = new Logger(CheckinRulesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna as regras de check-in de um evento.
   */
  async findByEvent(eventoId: string) {
    await this.ensureEventExists(eventoId);

    const regras = await this.prisma.checkinRule.findMany({
      where: { eventoId },
      orderBy: { createdAt: 'asc' },
    });

    return { regras };
  }

  /**
   * Atualiza (substitui) todas as regras de check-in de um evento.
   * Implementa validações de negócio:
   *  1. Deve existir ao menos 1 regra ativa
   *  2. Não pode haver conflito de janela entre regras obrigatórias ativas
   *  3. Nomes não podem ser duplicados
   */
  async updateByEvent(eventoId: string, dto: UpdateCheckinRulesDto) {
    const event = await this.ensureEventExists(eventoId);

    // ── Validações de negócio ──
    const errors: string[] = [];
    const conflicts: WindowConflict[] = [];

    // 1) Verificar duplicidade de nomes
    const nomes = dto.regras.map((r) => r.nome.toLowerCase().trim());
    const nomesUnicos = new Set(nomes);
    if (nomesUnicos.size !== nomes.length) {
      errors.push('Existem regras com nomes duplicados');
    }

    // 2) Verificar se há ao menos 1 regra ativa (quando há regras)
    if (dto.regras.length > 0) {
      const temRegraAtiva = dto.regras.some((r) => r.ativo);
      if (!temRegraAtiva) {
        errors.push('Deve existir ao menos 1 regra ativa');
      }
    }

    // 3) Verificar conflito de janela para regras obrigatórias ativas
    const regrasObrigatoriasAtivas = dto.regras.filter(
      (r) => r.ativo && r.obrigatoriedade === 'OBRIGATORIO',
    );

    if (regrasObrigatoriasAtivas.length >= 2) {
      const windowConflicts = this.detectWindowConflicts(regrasObrigatoriasAtivas, event.dataHora);
      conflicts.push(...windowConflicts);

      if (windowConflicts.length > 0) {
        errors.push(
          `Conflito de janela de validação detectado entre ${windowConflicts.length} par(es) de regras obrigatórias`,
        );
      }
    }

    // Se houver erros, retorna sem salvar
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validação de regras de check-in falhou',
        code: 'CHECKIN_RULES_VALIDATION_ERROR',
        details: {
          errors,
          conflicts,
        },
      });
    }

    // ── Persistência (transação: remove antigas e cria novas) ──
    const result = await this.prisma.$transaction(async (tx) => {
      // Remove todas as regras existentes do evento
      await tx.checkinRule.deleteMany({ where: { eventoId } });

      // Cria as novas regras
      if (dto.regras.length > 0) {
        await tx.checkinRule.createMany({
          data: dto.regras.map((r) => ({
            ...(r.id ? { id: r.id } : {}),
            nome: r.nome.trim(),
            ativo: r.ativo,
            obrigatoriedade: r.obrigatoriedade,
            liberarMinAntes: r.liberarMinAntes,
            encerrarMinDepois: r.encerrarMinDepois,
            eventoId,
          })),
        });
      }

      // Retorna as regras salvas
      return tx.checkinRule.findMany({
        where: { eventoId },
        orderBy: { createdAt: 'asc' },
      });
    });

    this.logger.log(
      `Regras de check-in atualizadas para evento ${eventoId}: ${result.length} regra(s)`,
    );

    return { regras: result };
  }

  // ────────────────────────────────────────────────────────────
  //  Validação de conflito de janela
  // ────────────────────────────────────────────────────────────

  /**
   * Detecta conflitos de janela entre regras obrigatórias ativas.
   *
   * Lógica:
   * Para cada regra obrigatória ativa, calcula-se o intervalo de check-in:
   *   - inicio = eventDateTime - liberarMinAntes minutos
   *   - fim    = eventDateTime + encerrarMinDepois minutos
   *
   * Conflito ocorre quando dois intervalos NÃO se intersectam, pois isso
   * significa que é impossível cumprir ambas as regras num mesmo período.
   *
   * Justificativa: Duas regras "obrigatórias" precisam ser cumpríveis dentro
   * de um período comum de check-in. Se não houver sobreposição, o usuário
   * ficaria impossibilitado de cumprir ambas.
   */
  private detectWindowConflicts(
    rules: CheckinRuleDto[],
    eventDateTime: Date,
  ): WindowConflict[] {
    const conflicts: WindowConflict[] = [];
    const eventTime = eventDateTime.getTime();

    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        const ruleA = rules[i];
        const ruleB = rules[j];

        const inicioA = eventTime - ruleA.liberarMinAntes * 60 * 1000;
        const fimA = eventTime + ruleA.encerrarMinDepois * 60 * 1000;
        const inicioB = eventTime - ruleB.liberarMinAntes * 60 * 1000;
        const fimB = eventTime + ruleB.encerrarMinDepois * 60 * 1000;

        // Verificar se NÃO há interseção
        const hasNoOverlap = fimA < inicioB || fimB < inicioA;

        if (hasNoOverlap) {
          conflicts.push({
            regraA: ruleA.nome,
            regraB: ruleB.nome,
            mensagem: `As janelas de "${ruleA.nome}" e "${ruleB.nome}" não se intersectam — impossível cumprir ambas as regras obrigatórias`,
          });
        }
      }
    }

    return conflicts;
  }

  // ────────────────────────────────────────────────────────────

  private async ensureEventExists(eventoId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventoId },
    });

    if (!event) {
      throw new NotFoundException({
        message: `Evento com ID "${eventoId}" não encontrado`,
        code: 'EVENT_NOT_FOUND',
      });
    }

    return event;
  }
}
