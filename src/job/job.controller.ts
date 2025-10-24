import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';

@Controller('job')
export class JobController {
  constructor(
    @InjectQueue('import-queue') private importQueue: Queue,
    @InjectQueue('export-queue') private exportQueue: Queue,
  ) {}

  @Post('import')
  async importJob(@Body() data: { filePath: string; fileType: string }) {
    await this.importQueue.add('import-job', {
      filePath: data.filePath,
      fileType: data.fileType,
    });

    return { message: 'Import job queued successfully' };
  }

  @Post('export')
  async exportJob(@Body() data: { minAge: number; userId: string }) {
    await this.exportQueue.add('export-job', {
      minAge: data.minAge,
      userId: data.userId,
    });

    return { message: 'Export job queued successfully' };
  }
}
