const fastify = require('fastify')({
    logger: true
})
const Tracer = require('./src/config/tracer')

const tracer = Tracer.getTracer('service-a')

fastify.get('/', (request, reply) => {
    const message = 'service-a is alive!'
    const span = tracer.startSpan('health-check')

    request.log.info(message)
    reply.send({ message })
    span.finish()
})

fastify.listen(process.env.SERVER_PORT, '0.0.0.0', (err) => {
    if (err) throw err
})