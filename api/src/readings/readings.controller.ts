import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service';

@Controller('tenants/:tenantId/readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get()
  list(
    @Param('tenantId') tenantId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.readingsService.listForTenant(tenantId, parseDate(from, 'from'), parseDate(to, 'to'));
  }
}

function parseDate(value: string | undefined, name: string): Date | undefined {
  if (value === undefined) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${name} must be an ISO 8601 date`);
  }
  return date;
}
