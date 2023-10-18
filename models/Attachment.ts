import {
    BeforeRemove,
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Newsletter } from "./Newsletter";
import { unlinkSync } from "fs";

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    path: string;

    @OneToOne(() => Newsletter, (newsletter) => newsletter.attachment)
    newsletter: Newsletter;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeRemove()
    remove() {
        try {
            unlinkSync(`${__dirname}/../${this.path}`);
        } catch (error) {
            console.log(error);
        }
    }
}
