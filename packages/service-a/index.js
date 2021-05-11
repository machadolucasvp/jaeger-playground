const fastify = require('fastify')({
    logger: true
})

fastify.get('/', (request, reply) => {
    const message = 'service-a is alive!'
    request.log.info(message)
    reply.send({ message })
})

fastify.listen(process.env.SERVER_PORT, '0.0.0.0', (err) => {
    if (err) throw err
})