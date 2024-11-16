import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import productsRoutes from './routes/products/products-routes.js';
import { resetStockJob } from './lib/jobs.js';
import { dailyLimiter } from './lib/rate-limit.js';
import helmet from 'helmet';
import morgan from 'morgan';

// env
config();

// cron jobs
resetStockJob();

const app: Express = express();

const httpLogger = morgan('tiny');

// middleware
app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(dailyLimiter);
app.use(helmet());

// routes
app.get('/', (req: Request, res: Response) => {
  req.log.info('Home route accessed');
  res.json({ message: 'Welcome to Furniture API' });
});
app.use('/v1', productsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
