import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>,
  ) {}

  async createOrganization(
    organizationData: Partial<Organization>,
  ): Promise<Organization> {
    try {
      const createdOrganization =
        await this.organizationModel.create(organizationData);
      return createdOrganization;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Organization could not be created`,
      );
    }
  }

  async getOrganizationById(
    id: string | Types.ObjectId,
  ): Promise<Organization> {
    const organization = await this.organizationModel.findById(id);
    if (!organization) {
      throw new NotFoundException(
        `Organization with id ${id} could not be found!`,
      );
    }
    return organization;
  }
}
