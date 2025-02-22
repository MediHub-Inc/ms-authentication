import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './organization.controller';
import { Business } from './organization.model';
import { BusinessService } from './organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService, TypeOrmModule.forFeature([Business])],
})
export class BusinessModule {}
