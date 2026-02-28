import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ParticipantsService } from './participants.service';
import {
  CreateParticipantDto,
  UpdateParticipantDto,
  FilterParticipantsDto,
  TransferParticipantDto,
} from './dto';

@ApiTags('Participantes')
@ApiBearerAuth()
@Controller('participantes')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar participantes',
    description:
      'Retorna lista paginada de participantes com filtros por nome, evento e status de check-in.',
  })
  @ApiResponse({ status: 200, description: 'Lista de participantes retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@Query() filters: FilterParticipantsDto) {
    return this.participantsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar participante por ID',
    description: 'Retorna os detalhes de um participante específico com dados do evento vinculado.',
  })
  @ApiParam({ name: 'id', description: 'UUID do participante' })
  @ApiResponse({ status: 200, description: 'Participante encontrado' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar participante',
    description: 'Cria um novo participante vinculado a um evento.',
  })
  @ApiResponse({ status: 201, description: 'Participante cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação ou evento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@Body() dto: CreateParticipantDto) {
    return this.participantsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar participante',
    description: 'Atualiza os dados de um participante existente.',
  })
  @ApiParam({ name: 'id', description: 'UUID do participante' })
  @ApiResponse({ status: 200, description: 'Participante atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateParticipantDto) {
    return this.participantsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover participante',
    description: 'Remove um participante do sistema.',
  })
  @ApiParam({ name: 'id', description: 'UUID do participante' })
  @ApiResponse({ status: 200, description: 'Participante removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.participantsService.remove(id);
  }

  @Post(':id/transferir')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Transferir participante para outro evento',
    description:
      'Transfere o participante para um novo evento, resetando o status de check-in.',
  })
  @ApiParam({ name: 'id', description: 'UUID do participante' })
  @ApiResponse({ status: 200, description: 'Participante transferido com sucesso' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  @ApiResponse({ status: 400, description: 'Evento destino não encontrado ou mesmo evento' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async transfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransferParticipantDto,
  ) {
    return this.participantsService.transfer(id, dto);
  }
}
