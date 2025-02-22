import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './organization.model';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  async createBusiness(business: Business): Promise<Business> {
    const createdBusiness = await this.businessRepository.create(business);
    if (!createdBusiness)
      throw new InternalServerErrorException(`Business could not be created`);
    const insertedBusiness = await this.businessRepository.save(
      createdBusiness,
    );
    if (!insertedBusiness)
      throw new InternalServerErrorException(`Business could not be save`);
    return insertedBusiness;
  }

  async getBusinessById(id: number): Promise<Business> {
    const business = await this.businessRepository.find({
      where: [
        {
          id: id.toString(),
        },
      ],
    });
    if (!business[0])
      throw new NotFoundException(`Business with id ${id} could not be found!`);
    return business[0];
  }
}
