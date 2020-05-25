import { ApolloError } from 'apollo-server';

export class UnknownError extends ApolloError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 'UNKNOWN_ERROR', properties);

    Object.defineProperty(this, 'name', { value: 'UnknownError' });
  }
}

export class MutationNotAllowedError extends ApolloError {
  constructor(
    message = 'mutation not allowed',
    properties?: Record<string, any>,
  ) {
    super(message, 'MUTATION_NOT_ALLOWED', properties);

    Object.defineProperty(this, 'name', { value: 'MutationNotAllowedError' });
  }
}
