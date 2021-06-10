require('dotenv').config()

const fastify = require('fastify')({
    logger: true
})
const Tracer = require('./src/config/tracer')
const axios = require('./src/config/axios')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')

const serviceName = 'service-a'
const tracer = Tracer.getTracer(serviceName)

fastify.get('/', (request, reply) => {
    const message = `${serviceName} is alive!`
    const span = tracer.startSpan('health-check')

    request.log.info(message)
    reply.send({ message })
    span.finish()
})

fastify.get('/downstream', async (request, reply) => {
    const span = tracer.startSpan('downstream')
    const headers = {}

    tracer.inject(span, FORMAT_HTTP_HEADERS, headers)
    try {
        const [responseServiceB, responseServiceC] = await Promise.all([
            axios.apiServiceB.get('/downstream', { headers }),
            axios.apiServiceC.get('/downstream', { headers })
        ])

        request.log.info(`service-b response ${responseServiceB.data}`)
        request.log.info(`service-c response ${responseServiceC.data}`)

        span.setTag(Tags.HTTP_STATUS_CODE, 200)

        reply.send({ responseServiceB, responseServiceC })
    } catch (err) {
        request.log.error(err)
        span.setTag(Tags.ERROR, true)
        span.setTag(Tags.HTTP_STATUS_CODE, err.response?.status ?? 500)
    }
    span.finish()
})

fastify.listen(process.env.SERVER_PORT, '0.0.0.0', (err) => {
    if (err) throw err
})