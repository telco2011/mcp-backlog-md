import pino from 'pino';
import pretty from 'pino-pretty';

/**
 * logger.ts
 *
 * Design Doc: ./docs/logging-strategy.md
 *
 * Purpose:
 * - Initializes and configures a singleton Pino logger instance for the application.
 * - Provides a standardized logger for all modules to use.
 *
 * Logic Overview:
 * - Configures pino-pretty for development-friendly, colorized console output.
 * - Sets a default log level of 'info'.
 *
 * Last Updated:
 * 2025-07-24 by Cline (Initial creation)
 */
const logger =
  process.env.NODE_ENV === 'development'
    ? pino(
        pretty({
          colorize: true,
          ignore: 'pid,hostname,context',
          customPrettifiers: {
            time: (timestamp) => `[${timestamp}]`,
            level: (logLevel) => {
              if (typeof logLevel === 'number') {
                const level = pino.levels.labels[logLevel];
                return `${level.toUpperCase()}`;
              }
              return 'UNKNOWN';
            },
          },
          messageFormat: (log, messageKey) => {
            const pinoLog = log as unknown as pino.LogDescriptor;
            const context = pinoLog.context || 'APP';
            const msg = pinoLog[messageKey as string];
            const meta = Object.fromEntries(
              Object.entries(pinoLog).filter(
                ([key]) =>
                  ![
                    'time',
                    'level',
                    'context',
                    'msg',
                    'message',
                    'name',
                  ].includes(key)
              )
            );
            const metaString =
              Object.keys(meta).length > 0
                ? `. [META]: ${JSON.stringify(meta)}`
                : '';
            return `[${context}]: ${msg}${metaString}`;
          },
        })
      )
    : pino();

export default logger;
