import { CodegenStep, CodegenFile } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { Mutation } from '@aphro/mutation-grammar';
import { TypescriptFile, importsToString } from '@aphro/codegen-ts';
// TODO: tsImport should probably go into `codegen-ts`
import { tsImport } from '@aphro/schema';
// TODO: Import should probably go into `codegen-api`?
import { Import } from '@aphro/schema-api';
import { collectImportsForMutations, getArgNameAndType } from './shared.js';
import { upcaseAt } from '@strut/utils';

/**
 * TODO:
 * We need to not generate this file only if it does not already exists.
 * If it does exist, we need to:
 * 1. Get the ast
 * 2. See what functions are exported
 * 3. Only generates those that are new
 */
export class GenTypescriptMutationImpls extends CodegenStep {
  static accepts(schema: Node): boolean {
    return Object.values(schema.extensions.mutations?.mutations || []).length > 0;
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new TypescriptFile(
      this.schema.name + 'MutationsImpl.ts',
      `${importsToString(this.collectImports())}

${this.getCode()}
`,
    );
  }

  private getCode(): string {
    return Object.values(this.schema.extensions.mutations?.mutations || {})
      .map(m => this.getMutationFunctionDefCode(m))
      .join('\n\n');
  }

  private getMutationFunctionDefCode(m: Mutation): string {
    const destructured = getArgNameAndType(m.args, true);
    const casedName = upcaseAt(m.name, 0);
    return `export function ${m.name}(mutator: Omit<ICreateOrUpdateBuilder, 'toChangeset'>, ${destructured}: ${casedName}Args): void | Changeset[] {
      // Use the provided mutator to make your desired changes.
      // e.g., mutator.set({name: "Foo" });
      // You do not need to return anything from this method. The mutator will track your changes.
      // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
    }`;
  }

  private collectImports(): Import[] {
    return [...this.importArgTypes(), ...collectImportsForMutations(this.schema)];
  }

  private importArgTypes(): Import[] {
    return Object.values(this.schema.extensions.mutations?.mutations || {}).map(m => {
      const typeName = upcaseAt(m.name, 0) + 'Args';
      return tsImport(`{${typeName}}`, null, `./${this.schema.name}Mutations.js`);
    });
  }
}
