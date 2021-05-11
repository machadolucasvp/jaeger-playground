const fastify = require('fastify')({
    logger: true
})

fastify.get('/', (request, reply) => {
    const message = 'service-b is alive!'
    request.log.info(message)
    reply.send({ message })
})

fastify.listen(process.env.SERVER_PORT, (err) => {
    if (err) throw err
})