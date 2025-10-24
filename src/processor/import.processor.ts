import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rejects } from 'assert';
import { Job } from 'bullmq';
import { count } from 'console';
import csvParser from 'csv-parser';
import { createReadStream, unlinkSync } from 'fs';
import { resolve } from 'path';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Repository } from 'typeorm';
const XLSX = require('xlsx');

@Processor('import-queue')
@Injectable()
export class ImportProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    const { filePath, fileType } = job.data;
    const vehicles = [];

    if (fileType === 'csv') {
      await this.processCSV(filePath, vehicles);
    } else if (fileType === 'excel') {
      await this.processExcel(filePath, vehicles);
    }

    // Save to the database
    await this.vehicleRepository.save(vehicles);

    // Delete file after processsing
    unlinkSync(filePath);

    return { success: true, count: vehicles.length };
  }

  private processCSV(filePath: string, vehicles: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          vehicles.push(this.mapToVehicle(row));
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }

  private async processExcel(filePath: string, vehicles: any[]) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    rows.forEach((row: any) => {
      vehicles.push(this.mapToVehicle(row));
    });
  }

  private mapToVehicle(row: any): Partial<Vehicle> {
    const manufacturedDate = new Date(row.manufactured_date);
    const ageOfVehicle =
      new Date().getFullYear() - manufacturedDate.getFullYear();

    return {
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      car_make: row.car_make,
      car_model: row.car_model,
      vin: row.vin,
      manufactured_date: manufacturedDate,
      age_of_vehicle: ageOfVehicle,
    };
  }
}
