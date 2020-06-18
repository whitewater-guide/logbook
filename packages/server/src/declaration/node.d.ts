declare namespace NodeJS {
  interface ProcessEnv {
    LOG_LEVEL?: string;
    POSTGRES_HOST: string;
    POSTGRES_USER: string;
    POSTGRES_DB: string;
    POSTGRES_PASSWORD: string;
    APOLLO_EXPOSE_SCHEMA?: string;
    APOLLO_EXPOSE_PLAYGROUND?: string;
    JWT_SECRET: string;
    JWT_UID_KEY?: string;
  }
}
