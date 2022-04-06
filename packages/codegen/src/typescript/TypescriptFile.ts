import { sign } from '../CodegenFile.js';
import { CodegenFile, ALGOL_TEMPLATE } from '@aphro/codegen-api';
// @ts-ignore
import prettier from 'prettier';

export default class TypescriptFile implements CodegenFile {
  #contents: string;

  constructor(public readonly name: string, contents: string) {
    this.#contents = contents;
  }

  get contents(): string {
    return sign(prettier.format(this.#contents, { parser: 'typescript' }), ALGOL_TEMPLATE);
  }
}
