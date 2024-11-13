import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import pinoHttp from 'pino-http';
import productsRoutes from './routes/products/products-routes';

config();

const app: Express = express();

// Create HTTP logger middleware
const httpLogger = pinoHttp();

// middleware
app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
