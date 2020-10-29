'use strict';

let varCounter = null;

const toQuery = (value) => {
  if (value instanceof Cypher) {
    const [query, params] = [...value];
    return {query, params}
  } else {
    const varId = `v${varCounter}`;
    varCounter += 1;
    return { query: `$${varId}`, params: { [varId]: value } }
  }
};

const getResults = (strings, values) =>
  values
    .map(toQuery)
    .map(({ query, params }, index) =>
      ({ query: `${query}${strings[index]}`, params }));

function cypherFn() {

}

class Cypher extends {
  __proto__: cypherFn()
} {
  static defaultPrefix = 'v'

  constructor (strings, values) {
    super();
    Object.assign(this, { strings, values });
  }

  * [Symbol.iterator] () {
    let isExternalCall = varCounter === null;
    if (isExternalCall) {
      varCounter = 0;
    }
    const [prefixString, ...strings] = this.strings;
    const results = getResults(strings, this.values);
    const query = results
      .map(({ query }) => query)
      .reduce((s, q) => s + q, prefixString);
    const params = Object.assign({}, ...results.map(({ params }) => params));
    if (isExternalCall) {
      varCounter = null;
    }
    yield * [query, params];
  }
}

// I do not know why anyone would need this, but maybe this will help someone
// noinspection JSUnusedGlobalSymbols
const __internals__ = {
  Cypher
};

const tag = (...args) => {
  if (Array.isArray(args[0])) {
    return new Cypher(args[0], args.slice(1))
  } else if (args[0] instanceof Object) {
    const object = args[0];
    const keys = args[1] || Object.keys(args[0]);
    return new Cypher([...keys.map(key => `${key}:`), ''], keys.map(key => object[key]))
  } else {
    throw new TypeError('unsupported arguments')
  }
};

tag.tag = tag;
tag.__internals__ = __internals__;

module.exports = tag;
