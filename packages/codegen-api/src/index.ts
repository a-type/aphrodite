export * from './CodegenFile.js';
export { default as CodegenStep } from './CodegenStep.js';
import CodegenStep from './CodegenStep.js';
import { Node, Edge, SchemaFile } from '@aphro/schema-api';

export type Step = {
  new (x: Node | Edge, dest: string): CodegenStep;
  accepts: (x: Node | Edge) => boolean;
};

export type GlobalStep = {
  new (nodes: Node[], edges: Edge[], schemaFileName: string): CodegenStep;
};
