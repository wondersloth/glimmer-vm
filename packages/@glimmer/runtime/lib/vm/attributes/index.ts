import { Option, Environment, ElementBuilder } from '@glimmer/interfaces';
import { AttrNamespace, SimpleElement } from '@simple-dom/interface';

export interface Attribute {
  element: SimpleElement;
  name: string;
  namespace: Option<AttrNamespace>;
}

export interface AttributeOperation {
  attribute: Attribute;
  set(dom: ElementBuilder, value: unknown, env: Environment): void;
  update(value: unknown, env: Environment): void;
}
