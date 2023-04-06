import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { routes } from "./routes";

const app = fastify()

app.register(fastifyMultipart)

app.register(routes)

app.listen({
    port: 8000
}).then(server => console.log('HTTP server running...'))
