# Previously

```ts
import { Context } from '@glimmer/opcode-builder';
import { Component } from '@glimmer/opcode-compiler';
import { State } from '@glimmer/references';

/// COMPILATION

let source = `
  {{#let "hello" "world" as |hello world|}}
    <p>{{hello}} {{world}}{{this.prefix}} (count: {{increment this.count}})</p>
  {{/let}}
`;

const RESOLVER_DELEGATE = {
  lookupHelper(name: string): Option<number> {
    if (name === 'increment') return 0;

    return null;
  },
};

let context = Context(RESOLVER_DELEGATE);
let component = Component(source);
let handle = component.compile(context);

let program = artifacts(context);

/// RUNTIME

import createHTMLDocument from '@simple-dom/document';
import { Runtime, renderAot } from '@glimmer/runtime';

const RUNTIME_RESOLVER = {
  resolve(handle: number) {
    if (handle === 0) {
      return increment;
    } else {
      throw new Error(`Unexpected handle ${handle}`);
    }
  },
};

function increment(args: VMArguments): Reference {
  let arg = args.positional.at(0);
  return map(arg, i => i + 1);
}

let document = createHTMLDocument();
let runtime = Runtime(document, payload, RUNTIME_RESOLVER);
let main = document.createElement('main');
let state = State({ prefix: '!', count: 5 });
let cursor = { element: main, nextSibling: null };
let iterator = renderAot(runtime, handle, cursor, state);
let result = iterator.sync();

console.log(serialize(element));
// <main><p>hello world! (count: 6)</p></main>

state.update({ prefix: '?', count: 10 });
result.rerender();
console.log(serialize(element));
// <main><p>hello world? (count: 11)</p></main>

function serialize(element: SimpleElement): string {
  return new Serializer(voidMap).serialize(element);
}
```

# Other Components

A single component plus some helpers is nice and all, but real programs have more than one component.

Global components work similarly to global helpers: the `ResolverDelegate` turns a component name into a handle, and the runtime takes that handle and produces the component.

```ts
const HELPERS = {
  increment: 0,
};

const COMPONENTS = {
  Second: {
    source: `<p>{{@hello}} {{@world}}{{@suffix}} ({{increment @num}})</p>`,
    handle: 1,
  },
};

// A map of helpers to runtime handles (that will be passed to the runtime resolver).
const HELPERS = {
  increment: 0,
};

// A map of components to their source code and the runtime handle (that will be passed
// to the runtime resolver).
const COMPONENTS: Dict<{ source: string; handle: number }> = {
  Second: {
    source: `<p>{{@hello}} {{@world}}{{@suffix}} ({{increment @num}})</p>`,
    handle: 1,
  },
};

export const RESOLVER_DELEGATE: ResolverDelegate = {
  lookupComponent(name: string): Option<CompileTimeComponent> | void {
    let component = COMPONENTS[name];
    if (component === null) return null;

    let { handle, source } = component;

    return {
      handle,
      compilable: Compilable(source),
      capabilities: MINIMAL_CAPABILITIES,
    };
  },

  lookupHelper(name: keyof typeof HELPERS): Option<number> | void {
    if (name in HELPERS) return HELPERS[name];
  },
};
```
