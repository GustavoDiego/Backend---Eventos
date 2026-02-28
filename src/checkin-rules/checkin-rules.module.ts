import { Module } from '@nestjs/common';
import { CheckinRulesController } from './checkin-rules.controller';
import { CheckinRulesService } from './checkin-rules.service';

@Module({
  controllers: [CheckinRulesController],
  providers: [CheckinRulesService],
  exports: [CheckinRulesService],
})
export class CheckinRulesModule {}
