import express, { Express, Request, Response } from 'express';
import serverConfig from './config/server-config';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import globalErrorHandler from './middlewares/global-error-handler';

const app: Express = express();

const origins: string = serverConfig.CORS_ORIGIN;

const limiter: RateLimitRequestHandler = rateLimit({
    windowMs: serverConfig.RATE_LIMIT_WINDOW_MS,
    limit: serverConfig.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response): void => {
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
            error: 'Too many requests',
            message: `You have exceeded the rate limit. Please try again after 10 minutes.`,
        });
    },
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(
    cors({
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST'],
    }),
);

app.get('/health', async (_req: Request, res: Response): Promise<void> => {
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Server is up and running smoothly!',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.use(globalErrorHandler);

export default app;
