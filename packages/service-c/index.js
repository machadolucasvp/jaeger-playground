require('dotenv').config()
const fastify = require('fastify')({
    logger: true
})
const axios = require('./src/config/axios')
const Tracer = require('./src/config/tracer')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')


const serviceName = 'service-c'
const tracer = Tracer.getTracer(serviceName)

fastify.get('/', (request, reply) => {
    const message = `${serviceName} is alive!`
    request.log.info(message)
    reply.send({ message })
})

fastify.get('/downstream', async (request, reply) => {
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('request-downstream', { childOf: parentSpanContext })

    const headers = {}

    tracer.inject(span, FORMAT_HTTP_HEADERS, headers)
    try {
        const { status, data } = await axios.apiServiceD.get('/downstream', { headers })

        request.log.info(`service-d response ${data}`)
        span.setTag(Tags.HTTP_STATUS_CODE, status)

        reply.send({ status, data })
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