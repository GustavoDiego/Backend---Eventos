import { Controller, Get, Put, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CheckinRulesService } from './checkin-rules.service';
import { UpdateCheckinRulesDto } from './dto';

@ApiTags('Regras de Check-in')
@ApiBearerAuth()
@Controller('eventos/:eventoId/regras-checkin')
export class CheckinRulesController {
  constructor(private readonly checkinRulesService: CheckinRulesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar regras de check-in do evento',
    description:
      'Retorna todas as regras de check-in configuradas para o evento especificado.',
  })
  @ApiParam({ name: 'eventoId', description: 'UUID do evento' })
  @ApiResponse({ status: 200, description: 'Regras retornadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findByEvent(@Param('eventoId', ParseUUIDPipe) eventoId: string) {
    return this.checkinRulesService.findByEvent(eventoId);
  }

  @Put()
  @ApiOperation({
    summary: 'Atualizar regras de check-in do evento',
    description: `Substitui todas as regras de check-in do evento. 
      
Validações aplicadas:
- **Deve existir ao menos 1 regra ativa** (quando há regras)
- **Sem conflito de janela** entre regras obrigatórias ativas (janelas devem se intersectar)
- **Nomes únicos** (sem duplicidade)
- **Campos numéricos** entre 0 e 1440 minutos (1 dia)
- **Nome** com mínimo de 3 caracteres

**Lógica de conflito de janela:**
Para cada regra obrigatória ativa, calcula-se o intervalo relativo ao horário do evento:
- inicio = dataHoraEvento - liberarMinAntes
- fim = dataHoraEvento + encerrarMinDepois

Conflito detectado quando duas janelas obrigatórias ativas NÃO se intersectam.`,
  })
  @ApiParam({ name: 'eventoId', description: 'UUID do evento' })
  @ApiResponse({ status: 200, description: 'Regras atualizadas com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação (regras inválidas, conflito de janela, etc.)',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async updateByEvent(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() dto: UpdateCheckinRulesDto,
  ) {
    return this.checkinRulesService.updateByEvent(eventoId, dto);
  }
}
