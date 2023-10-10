import { DataSource } from "typeorm"
import { Friend } from "./database/entity/Friend"
import { User } from "./database/entity/User"


const isProd = process.argv.includes("--prod");

// console.log(isProd);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: isProd?process.env.PGHOST:"localhost",
    port: 5432,
    username: isProd?process.env.PGUSER:"postgres",
    password: isProd?process.env.PGPASSWORD:"1480",
    database: isProd?"main":"socket_test",
    extra: { sslmode: 'require' },
    synchronize: true,
    logging: true,
    entities: [User,Friend],
    subscribers: [],
    migrations: [],
    ...(!isProd
        ? {}
        : {
            ssl: {
              rejectUnauthorized: false,
            },
          }),
    
})
