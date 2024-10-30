import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

const port =  Number(process.env.PORT) || 3001;

fastify.get('/', async (request, reply) => {
    return { pong: 'it works! home page' };
});

fastify.get('/ping', async (request, reply) => {
    return { pong: 'it works!' };
});

const start = async () => {
    try {
        await fastify.listen({ port: port });
        console.log(`Server is running on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();