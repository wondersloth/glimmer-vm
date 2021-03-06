import { ComponentDefinition, RuntimeResolver } from '@glimmer/interfaces';
import { Option, assert } from '@glimmer/util';

export function resolveComponent<L>(
  resolver: RuntimeResolver<L>,
  name: string,
  meta?: L
): Option<ComponentDefinition> {
  let definition = resolver.lookupComponent(name, meta);
  assert(definition, `Could not find a component named "${name}"`);
  return definition;
}
