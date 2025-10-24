import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { ImportProcessor } from './import.processor';
import { ExportProcessor } from './export.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    BullModule.registerQueue({
      name: 'import-queue',
    }),
    BullModule.registerQueue({
      name: 'export-queue',
    }),
  ],
  providers: [ImportProcessor, ExportProcessor],
  exports: [ImportProcessor, ExportProcessor],
})
export class ProcessorModule {}
