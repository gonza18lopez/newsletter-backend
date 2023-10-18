import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Newsletter } from "./Newsletter";

@Entity()
export class Recipient {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    email: string;

    @Column()
    @Generated("uuid")
    token: string;

    @ManyToMany(() => Newsletter, (newsletter) => newsletter.recipients)
    newsletters: Newsletter[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
