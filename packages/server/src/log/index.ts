import pino from 'pino';

const log = pino({
  level: process.env.NODE_ENV === 'test' ? 'silent' : process.env.LOG_LEVEL,
  prettyPrint:
    process.env.NODE_ENV === 'development'
      ? {
          colorize: true,
          levelFirst: true,
          translateTime: 'yyyy/mm/dd HH:MM:ss:l',
          ignore: 'pid,hostname',
        }
      : false,
});

export default log;
