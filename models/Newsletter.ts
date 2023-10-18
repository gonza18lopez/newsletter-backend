import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Attachment } from "./Attachment";
import { Recipient } from "./Recipient";

@Entity()
export class Newsletter {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @OneToOne(() => Attachment, (newsletter) => newsletter.newsletter)
    @JoinColumn()
    attachment: Attachment;

    @ManyToMany(() => Recipient, (recipient) => recipient.newsletters, {
        cascade: true,
    })
    @JoinTable()
    recipients: Recipient[];

    @Index("name_index")
    @Column()
    name: string;

    @Column("longtext")
    body: string;

    @Column("boolean", { default: false })
    isSent: boolean;

    @Column("datetime")
    sendAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
