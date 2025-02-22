import { Body, Controller, Post } from '@nestjs/common';
import { Business } from './business.model';
import { BusinessService } from './business.service';

@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService) {}
  @Post()
  create(@Body() business: Business) {
    return this.businessService.createBusiness(business);
  }
}
