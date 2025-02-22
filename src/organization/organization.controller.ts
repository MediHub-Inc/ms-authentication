import { Body, Controller, Post } from '@nestjs/common';
import { Business } from './organization.model';
import { BusinessService } from './organization.service';

@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService) {}
  @Post()
  create(@Body() business: Business) {
    return this.businessService.createBusiness(business);
  }
}
