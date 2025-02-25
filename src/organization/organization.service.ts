import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.model';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async createOrganization(organization: Organization): Promise<Organization> {
    console.log("organization: ", organization);
    const createdOrganization = await this.organizationRepository.create(organization);
    if (!createdOrganization)
      throw new InternalServerErrorException(`Organization could not be created`);
    const insertedOrganization = await this.organizationRepository.save(
      createdOrganization,
    );
    if (!insertedOrganization)
      throw new InternalServerErrorException(`Organization could not be save`);
    return insertedOrganization;
  }

  async getOrganizationById(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.find({
      where: [
        {
          id: id.toString(),
        },
      ],
    });
    if (!organization[0])
      throw new NotFoundException(`Organization with id ${id} could not be found!`);
    return organization[0];
  }
}
