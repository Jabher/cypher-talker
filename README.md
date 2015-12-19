# Simple ES6/7-oriented lib to work with neo4j and (in future) with OpenCypher-compatible databases
_this software is early alpha stage and is not supposed to be used in production_

_Intended to be used as backing layer for other libraries_

## Usage example

```javascript
console.log(Cypher.tag`test: ${'testVar'}`.getRawQuery()) 
// => {query: 'test: {v0}', params: {v0: 'testVar'}}
```

and embedded requests: 
```javascript
const req = Cypher.tag`test2: ${`testVar`}`
console.log(Cypher.tag`test${req}`.getRawQuery())
// => {query: 'test: test2: {v0_0}', params: {v0_0: 'testVar'}}
```

Utility helpers:
```javascript
//Cypher.raw:
Cypher.tag`CREATE (entry:${Cypher.raw(label)})`
//cypher.literal - iterates over object so it can be used for props:
Cypher.tag`MATCH (target ${Cypher.literal(props)})`
```
 
## API

```typescript
export class Connection {
    constructor(/*neo4j arguments for now*/) 
}

export class Cypher {
    static defaultPrefix: string = 'v'
    
    static raw(string): Cypher.Raw
    
    static tag(Array<string>, ...Array<any>): Cypher // used as string tag
       
    static literal(Object): Cypher
    
    getRawQuery(): {query: string, params: Object}     
}
```

## Roadmap
- [ ] request optimisation