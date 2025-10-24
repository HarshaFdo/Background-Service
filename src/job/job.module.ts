import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JobController } from './job.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'import-queue',
    }),
    BullModule.registerQueue({
      name: 'export-queue',
    }),
  ],
  controllers: [JobController],
})
export class JobModule {}
