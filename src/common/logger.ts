/* eslint-disable @typescript-eslint/no-var-requires */

import { createLogger, format, transports } from 'winston';
const LokiTransport = require('winston-loki');

const logger = createLogger({
  level: 'debug',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new LokiTransport({
      host: 'https://positive-aardvark-loudly.ngrok-free.app',
      labels: { job: 'apc-backend' },
    }),
    new transports.Console(),
  ],
});

export default logger;
