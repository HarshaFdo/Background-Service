import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ProcessorModule } from './processor/processor.module';
import { NotificationModule } from './notification/notification.module';
import { Vehicle } from './entities/vehicle.entity';
import { JobModule } from './job/job.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'vehicle_db',
      entities: [Vehicle],
      synchronize: false, // Don't modify schema - vehicle-service handles it
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    JobModule,
    ProcessorModule,
    NotificationModule,
  ],
  controllers: [],
  exports: [],
})
export class AppModule {}
