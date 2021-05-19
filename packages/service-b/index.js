const fastify = require('fastify')({
    logger: true
})
const Tracer = require('./src/config/tracer')
const { FORMAT_HTTP_HEADERS } = require('opentracing')

const tracer = Tracer.getTracer('service-b')

fastify.get('/', (request, reply) => {
    const message = 'service-b is alive!'
    request.log.info(message)
    reply.send({ message })
})

fastify.get('/downstream', (request, reply) => {
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, request.headers)
    const span = tracer.startSpan('downstream', { childOf: parentSpanContext })

    const helloFromMessage = 'hello from service-b'
    span.log({
        'event': 'ping-downstream',
        'value': helloFromMessage
    })

    request.log.info(helloFromMessage)
    reply.send({ message: helloFromMessage })
    span.finish()
})

fastify.listen(process.env.SERVER_PORT, '0.0.0.0', (err) => {
    if (err) throw err
})