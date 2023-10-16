import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BeforeInsert,
} from "typeorm";
import * as crypto from "crypto";
import { IsEmail } from "class-validator";
@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Index("email_index")
    @Column({
        unique: true,
    })
    @IsEmail()
    email: string;

    @Column()
    password: string;

    @Column()
    access_token: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateAccessToken() {
        this.access_token = crypto.randomBytes(16).toString("hex");
    }
}
