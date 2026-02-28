import { PrismaClient, EventStatus, CheckinStatus, RuleRequired } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ── Limpar dados existentes ──────────────────────────────
  await prisma.checkinRule.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // ── Usuário Admin ────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('senha123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@eventos.com',
      password: hashedPassword,
    },
  });
  console.log(`✅ Usuário criado: ${admin.email} (senha: senha123)`);

  // ── Segundo Usuário ──────────────────────────────────────
  const user2 = await prisma.user.create({
    data: {
      name: 'Maria Organizadora',
      email: 'maria@eventos.com',
      password: await bcrypt.hash('senha123', 12),
    },
  });
  console.log(`✅ Usuário criado: ${user2.email} (senha: senha123)`);

  // ── Eventos ──────────────────────────────────────────────
  const evento1 = await prisma.event.create({
    data: {
      nome: 'Expo Tech 2026',
      dataHora: new Date('2026-03-15T18:00:00.000Z'),
      local: 'Centro de Convenções - São Paulo',
      status: EventStatus.ATIVO,
    },
  });

  const evento2 = await prisma.event.create({
    data: {
      nome: 'Workshop de IA',
      dataHora: new Date('2026-04-10T14:00:00.000Z'),
      local: 'Auditório Central - Rio de Janeiro',
      status: EventStatus.ATIVO,
    },
  });

  const evento3 = await prisma.event.create({
    data: {
      nome: 'Meetup JavaScript',
      dataHora: new Date('2026-03-20T19:00:00.000Z'),
      local: 'Espaço Digital - Belo Horizonte',
      status: EventStatus.ATIVO,
    },
  });

  const evento4 = await prisma.event.create({
    data: {
      nome: 'Hackathon 2025',
      dataHora: new Date('2025-12-01T08:00:00.000Z'),
      local: 'Campus FIAP - São Paulo',
      status: EventStatus.ENCERRADO,
    },
  });

  const evento5 = await prisma.event.create({
    data: {
      nome: 'Conferência DevOps',
      dataHora: new Date('2026-05-20T09:00:00.000Z'),
      local: 'Hotel Transamerica - São Paulo',
      status: EventStatus.ATIVO,
    },
  });

  console.log(`✅ ${5} eventos criados`);

  // ── Participantes ────────────────────────────────────────
  const participantes = [
    { nome: 'Ana Silva', email: 'ana@email.com', eventoId: evento1.id, checkin: CheckinStatus.FEITO },
    { nome: 'Bruno Costa', email: 'bruno@email.com', eventoId: evento1.id, checkin: CheckinStatus.NAO_FEITO },
    { nome: 'Carla Souza', email: 'carla@email.com', eventoId: evento1.id, checkin: CheckinStatus.FEITO },
    { nome: 'Daniel Lima', email: 'daniel@email.com', eventoId: evento2.id, checkin: CheckinStatus.NAO_FEITO },
    { nome: 'Elena Santos', email: 'elena@email.com', eventoId: evento2.id, checkin: CheckinStatus.FEITO },
    { nome: 'Fernando Alves', email: 'fernando@email.com', eventoId: evento3.id, checkin: CheckinStatus.NAO_FEITO },
    { nome: 'Gabriela Rocha', email: 'gabriela@email.com', eventoId: evento3.id, checkin: CheckinStatus.NAO_FEITO },
    { nome: 'Hugo Mendes', email: 'hugo@email.com', eventoId: evento4.id, checkin: CheckinStatus.FEITO },
    { nome: 'Isabela Ferreira', email: 'isabela@email.com', eventoId: evento4.id, checkin: CheckinStatus.FEITO },
    { nome: 'João Oliveira', email: 'joao@email.com', eventoId: evento5.id, checkin: CheckinStatus.NAO_FEITO },
    { nome: 'Karen Pereira', email: 'karen@email.com', eventoId: evento1.id, checkin: CheckinStatus.NAO_FEITO },
    { nome: 'Lucas Martins', email: 'lucas@email.com', eventoId: evento2.id, checkin: CheckinStatus.NAO_FEITO },
  ];

  await prisma.participant.createMany({ data: participantes });
  console.log(`✅ ${participantes.length} participantes criados`);

  // ── Regras de Check-in ───────────────────────────────────
  // Evento 1 — 3 regras
  await prisma.checkinRule.createMany({
    data: [
      {
        nome: 'QR Code',
        ativo: true,
        obrigatoriedade: RuleRequired.OBRIGATORIO,
        liberarMinAntes: 30,
        encerrarMinDepois: 60,
        eventoId: evento1.id,
      },
      {
        nome: 'Documento com foto',
        ativo: true,
        obrigatoriedade: RuleRequired.OBRIGATORIO,
        liberarMinAntes: 30,
        encerrarMinDepois: 60,
        eventoId: evento1.id,
      },
      {
        nome: 'Lista Impressa',
        ativo: false,
        obrigatoriedade: RuleRequired.OPCIONAL,
        liberarMinAntes: 15,
        encerrarMinDepois: 30,
        eventoId: evento1.id,
      },
    ],
  });

  // Evento 2 — 2 regras
  await prisma.checkinRule.createMany({
    data: [
      {
        nome: 'Confirmação por E-mail',
        ativo: true,
        obrigatoriedade: RuleRequired.OBRIGATORIO,
        liberarMinAntes: 60,
        encerrarMinDepois: 120,
        eventoId: evento2.id,
      },
      {
        nome: 'QR Code',
        ativo: true,
        obrigatoriedade: RuleRequired.OPCIONAL,
        liberarMinAntes: 15,
        encerrarMinDepois: 30,
        eventoId: evento2.id,
      },
    ],
  });

  // Evento 3 — 1 regra
  await prisma.checkinRule.createMany({
    data: [
      {
        nome: 'QR Code',
        ativo: true,
        obrigatoriedade: RuleRequired.OBRIGATORIO,
        liberarMinAntes: 20,
        encerrarMinDepois: 45,
        eventoId: evento3.id,
      },
    ],
  });

  console.log(`✅ Regras de check-in criadas para 3 eventos`);
  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('   E-mail: admin@eventos.com');
  console.log('   Senha:  senha123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
