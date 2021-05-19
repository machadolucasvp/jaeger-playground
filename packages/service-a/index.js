const fastify = require('fastify')({
    logger: true
})
const Tracer = require('./src/config/tracer')
const axios = require('./src/config/axios')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')

const tracer = Tracer.getTracer('service-a')

fastify.get('/', (request, reply) => {
    const message = 'service-a is alive!'
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
        const { status, data } = await axios.apiServiceB.get('/downstream', { headers })

        request.log.info(`service-b response ${data}`)
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