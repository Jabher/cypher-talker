# Cypher-talker: Tag strings for neo4j
_Zero dependencies and zero pain_ 

Tired of writing neo4j queries like this?
```javascript
s.run('MERGE (alice:Person {name : $nameParam, age : $ageParam})', {
    nameParam: 'Alice',
    ageParam: 21
})
```

Try `cypher-talker` to write like this:
```javascript
import t from 'cypher-talker'

s.run(...t`MERGE (alice:Person {name : ${'Alice'}, age : ${21})`)
```

Or even like this:
```javascript
import t from 'cypher-talker'

const alice = {name: 'Alice', age: 21}
s.run(...t`MERGE (alice:Person ${t(alice)})`)
```

It converts template strings to real queries with params, primitives and objects to query variables,
allows nested queries and even has special (yet simple) syntax for inlining and object spread.

It just works.

### Installation

Just run `npm i cypher-talker` or `pnpm i cypher-talker` or `yarn add cypher-talker`, whatever you like.

Then use it. It ships with single default export. 

```javascript
import t from 'cypher-talker'
// or 
const t = require('cypher-talker')
```

It ships both with CommonJS and ESM packages, runs in latest browsers and NodeJS.

It even should work with Deno. It is single-module package (use `index.mjs`)

## Variables

Just use variables. Cypher-talker will extract them.
Variables come in incremental order, `v0`, then `v1`, `v2` and so on.

```javascript
const q = t`hello ${'world'}`
console.log([...q]) // ['hello $v0', {v0: 'world'}]
```

## Nested queries

If you need to re-use query parts, just inline them. No nesting limits.

```javascript
const q1 = t`hello`
const q2 = t`${q1} world`
console.log([...q2]) // ['hello world', {}]
```

## Spreading the object

Sometimes you want to pass object where you cannot really pass variable - like into the pattern-matching query.

Use `t()` instead.

```javascript
const q = t`${t({hello: 'world'})}`
console.log([...q]) // ['hello: $v0', {v0: 'world'}]
```

## How it works

`t` is a overloaded function that handles
- template strings syntax
- single object argument
- or single string argument

and always returning an iterable object of 2 items: resulting query and vars arg.
See tests for detailed examples.
