import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CheckinRuleDto } from './checkin-rule.dto';

export class UpdateCheckinRulesDto {
  @ApiProperty({
    description: 'Lista completa de regras de check-in do evento',
    type: [CheckinRuleDto],
  })
  @IsArray({ message: 'regras deve ser um array' })
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => CheckinRuleDto)
  regras: CheckinRuleDto[];
}
