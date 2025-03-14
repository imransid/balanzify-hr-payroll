import { ApolloError } from 'apollo-server-errors';

export class GraphQLException extends ApolloError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}
