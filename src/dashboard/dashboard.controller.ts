import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Obter resumo do dashboard',
    description:
      'Retorna indicadores gerais: total de eventos, participantes, check-ins, próximos eventos e últimas atividades.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumo retornado com sucesso',
    type: DashboardResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getSummary() {
    return this.dashboardService.getSummary();
  }
}
