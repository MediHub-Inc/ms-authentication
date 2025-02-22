import { Body, Controller, Post } from '@nestjs/common';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';

@Controller('organization') 
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}
  @Post()
  create(@Body() organization: Organization) {
    return this.organizationService.createOrganization(organization);
  }
}
