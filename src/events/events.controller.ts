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
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, FilterEventsDto } from './dto';

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('eventos')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar eventos',
    description: 'Retorna lista paginada de eventos com filtros por nome, status, período e local.',
  })
  @ApiResponse({ status: 200, description: 'Lista de eventos retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@Query() filters: FilterEventsDto) {
    return this.eventsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar evento por ID',
    description: 'Retorna os detalhes de um evento específico, incluindo contagem de participantes e regras de check-in.',
  })
  @ApiParam({ name: 'id', description: 'UUID do evento' })
  @ApiResponse({ status: 200, description: 'Evento encontrado' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar evento',
    description: 'Cadastra um novo evento no sistema.',
  })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar evento',
    description: 'Atualiza os dados de um evento existente.',
  })
  @ApiParam({ name: 'id', description: 'UUID do evento' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  @ApiResponse({ status: 400, description: 'Erro de validação' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover evento',
    description: 'Remove um evento e todos os dados associados (participantes e regras de check-in).',
  })
  @ApiParam({ name: 'id', description: 'UUID do evento' })
  @ApiResponse({ status: 200, description: 'Evento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.remove(id);
  }
}
