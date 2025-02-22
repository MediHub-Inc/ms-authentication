import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessController } from './business.controller';
import { Business } from './business.model';
import { BusinessService } from './business.service';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService, TypeOrmModule.forFeature([Business])],
})
export class BusinessModule {}
