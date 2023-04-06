import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { s3Client } from './s3-config'
import { randomBytes } from 'node:crypto'
import { config } from 'dotenv'

config()

export async function routes(app: FastifyInstance) {
    app.get('/', async (req: FastifyRequest, res: FastifyReply) => {
        return res.status(200).send('Olá Mundo!')
    })

    app.post('/upload', async (req: FastifyRequest, res: FastifyReply) => {
        const dataFile = await req.file()

        if (!dataFile) {
            return res.status(400).send({message: 'Envie um arquivo.'})
        }

        const Key = randomBytes(10).toString('hex') + '-' + dataFile.filename

        const Body = await dataFile.toBuffer()

        const params = {
            Bucket: process.env.BUCKET_NAME!,
            Key,
            Body
        };

        await s3Client.send(new PutObjectCommand(params))
            .then(_ => {
                const url = `https://${process.env.BUCKET_NAME!}.s3.amazonaws.com/${Key}`.replace(/\s/g, '+')

                return res.status(200).send({ 
                    message: `Sucesso ao subir ${dataFile.filename}`,
                    url
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).send({message: 'Algum erro ocorreu.'})
            })
    })
}
