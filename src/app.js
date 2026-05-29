import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { sanitizeInputs } from './security/sanitize.js';
import { apiLimiter } from './security/rateLimiters.js';
import routes from './routes.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin.includes('*') ? '*' : env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitizeInputs);
  app.use(apiLimiter);
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  const swaggerDocument = YAML.load(new URL('./docs/openapi.yaml', import.meta.url).pathname);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/api/v1', routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
