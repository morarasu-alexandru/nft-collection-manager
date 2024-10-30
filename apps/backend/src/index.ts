import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import cors from '@fastify/cors'; // Import the CORS plugin

// Load environment variables
dotenv.config();

const fastify = Fastify({ logger: true });
const port = Number(process.env.PORT) || 3001;

// Register CORS plugin
fastify.register(cors, {
    origin: 'http://localhost:3000', // Allow requests from localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    credentials: true, // Enable passing of cookies and credentials
});

// Initialize Supabase
const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
);

// Decorate Fastify instance with Supabase
fastify.decorate('supabase', supabase);

// Define interface for request with user data
interface AuthenticatedRequest extends FastifyRequest {
    user?: any;
}

// Authentication middleware
fastify.decorate(
    'authenticate',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            return reply.status(401).send({ error: 'Missing Authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }

        request.user = data.user;
    }
);

// Define public and protected routes
fastify.get('/', async (request, reply) => {
    return { pong: 'it works! home page' };
});

fastify.get('/ping', async (request, reply) => {
    return { pong: 'it works!' };
});

fastify.get(
    '/protected',
    { preHandler: [(fastify as any).authenticate] },
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
        return { message: 'Welcome to the protected route!', user: request.user };
    }
);

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port, host: '0.0.0.0' }); // Listen on all network interfaces
        console.log(`Server is running on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();