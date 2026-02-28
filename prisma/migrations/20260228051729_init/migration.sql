-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('ATIVO', 'ENCERRADO');

-- CreateEnum
CREATE TYPE "CheckinStatus" AS ENUM ('FEITO', 'NAO_FEITO');

-- CreateEnum
CREATE TYPE "RuleRequired" AS ENUM ('OBRIGATORIO', 'OPCIONAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "evento_id" TEXT NOT NULL,
    "checkin" "CheckinStatus" NOT NULL DEFAULT 'NAO_FEITO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkin_rules" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "obrigatoriedade" "RuleRequired" NOT NULL DEFAULT 'OPCIONAL',
    "liberar_min_antes" INTEGER NOT NULL DEFAULT 0,
    "encerrar_min_depois" INTEGER NOT NULL DEFAULT 0,
    "evento_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkin_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin_rules" ADD CONSTRAINT "checkin_rules_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
