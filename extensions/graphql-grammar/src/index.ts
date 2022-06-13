import { ValidationError } from '@aphro/schema-api';
import { GrammarExtension } from '@aphro/grammar-extension-api';

export const name = 'graphql';

declare module '@aphro/schema-api' {
  interface NodeExtensions {
    graphql?: GraphQL;
  }

  interface NodeAstExtensions {
    graphql?: GraphQL;
  }
}

declare module '@aphro/grammar-extension-api' {
  interface ExtensionPoints {
    GraphQLExtension: string;
  }
}

export type GraphQL = {
  name: 'graphql';
  expose: string[];
};

const extension: GrammarExtension<GraphQL, GraphQL> = {
  name: 'graphql',
  extends: {
    NodeFunction: 'GraphQL',
  },

  grammar(): string {
    return String.raw`
GraphQL
    = "GraphQL" "{" GraphQLReadDeclarations "}"

GraphQLReadDeclarations
    = "read" "{" GraphQLDeclarations "}"

GraphQLDeclarations
    = GraphQLDeclarations name -- list
    | "" -- empty
`;
  },

  actions() {
    return {
      GraphQL(_, __, read, ___) {
        return {
          name,
          read: read.toAst(),
        };
      },
      GraphQLReadDeclarations(_, __, declarations, ___) {
        return declarations.toAst();
      },
      GraphQLDeclarations_list: list,
      GraphQLDeclarations_empty: listInit,
    };
  },

  condensor(ast: GraphQL): [ValidationError[], GraphQL] {
    return [[], ast];
  },
};

export default extension;

const list = (l, r) => l.toAst().concat(r.toAst());
const listInit = _ => [];
