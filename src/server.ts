import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { routes } from "./routes";
import { config } from 'dotenv'

config()

const app = fastify()

app.register(fastifyMultipart)

app.register(routes)

app.listen({
    host: '0.0.0.0',
    port: Number(process.env.PORT!)
}).then(server => console.log('HTTP server running...'))
