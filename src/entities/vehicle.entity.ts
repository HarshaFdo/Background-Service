import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('vehicles')

export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    car_make:string

    @Column()
    car_model: string;

    @Column({unique: true})
    vin: string;

    @Column({type: 'date'})
    manufactured_date: Date;

    @Column({ type: 'int'})
    age_of_vehicle: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updateed_at: Date;
}