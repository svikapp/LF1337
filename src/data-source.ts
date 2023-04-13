import { DataSource } from "typeorm"
import { Friend } from "./database/entity/Friend"
import { User } from "./database/entity/User"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1480",
    database: "socket_test",
    synchronize: true,
    logging: true,
    entities: [User,Friend],
    subscribers: [],
    migrations: [],
})