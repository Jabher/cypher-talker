# Simple ES6/7-oriented lib to work with neo4j and (in future) with OpenCypher-compatible databases
_this software is early alpha stage and is not supposed to be used in production_

## Usage example

```javascript
import {Record, connect} from 'active-graph-record'
connect('http://neo4j:neo4j@localhost:7474')

class User extends Record {
    debug () {console.log({...this})}
}

User.register()

async function main () {
    const user = new User({first_name: 'John', last_name: 'Doe'})
    await user.save()
    const [resolvedUser] = await User.where({first_name: 'Jonh'})
    resolvedUser.debug() // => {first_name: 'John', last_name: 'Doe', uuid: '###', created_at: ###, updated_at: ###}
}
```

Yes, UUIDv4 is used instead of primary key. But you can ignore it (unless you're trying to hack the lib)
Created_at and updated_at can be used for sort.
 
## API

```typescript
class Record {
    static label: string //class name by default; can be overriden

    static register(): void   
    
    static async where(properties?: Object): Array<Record> 
    
    [property: string]: boolean | number | string
    
    constructor (properties?: Object)
    
    getRelation(relationLabel: string): Relation
    
    async save(properties?: Object): void 
    async delete(): void 
}
```


## Relations?
Yes, there are full-featured relations, see API.
All of the relations are non-directed polymorphic many-to-many, but actually you can not care about that.
Just think about relation as about async Set as interface is nearly same (except properties for Relation#entries).

```typescript
class Relation {
    async size(): number
    async add(record: Record): void
    async add(...records: Array<Record>): void
    async delete(record: Record): void
    async delete(...records: Array<Record>): void
    async entries(properies?: Object, type?: string): Array<Record>
}
```

If you need both direct and back relation, use same label:
```javascript
class ExampleObject extends Record {
    get subjects() { return this.getRelation('relation') }
}
ExampleObject.register()
class ExampleSubject extends Record {
    get objects() { return this.getRelation('relation') }
}
ExampleSubject.register()
```

##FAQ
#### How to extend something?
create class methods

#### How to save dates?


#### How to validate?
create getter and setter and validate there. Or create decorator (when @sebmck will bring their support back to babel).

#### How to...
Just use your imagination. It's just common ES6 class which is getting dumped to db from `{...this}` - taking only enumerable props.

## Roadmap
- [ ] sort
- [ ] offset and limit
- [ ] total test coverage
- [ ] performance optimisations
