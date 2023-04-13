import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Friend } from "./Friend"



@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("text")
    username: string

    @Column("text")
    email: string

    @Column("text")
    password: string

    // One-to-many relationship with Friend where user1 is the current user
    @OneToMany(() => Friend, friend => friend.sender)
    sentFriendRequests: Friend[];

    // One-to-many relationship with Friend where user2 is the current user
    @OneToMany(() => Friend, friend => friend.receiver)
    receivedFriendRequests: Friend[];
}