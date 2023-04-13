import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Friend {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("uuid")
    senderId: string;

    @ManyToOne(() => User)
    sender: User;

    @Column("uuid")
    receiverId: string;

    @ManyToOne(() => User)
    receiver: User;

    @Column({ type: 'boolean', default: false })
    isAccepted: boolean;

    @Column({ type: 'boolean', default: false })
    isDeclined: boolean;
}
