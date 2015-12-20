const getResults = (getKey, strings, values) =>
    values
        .reduce((a, val) => a.concat(val), [])
        .map((value, index) =>
            (value instanceof Cypher || value instanceof Cypher.Raw)
                ? value.getRawQuery({prefix: `${getKey(index)}_`})
                : {query: `{${getKey(index)}}`, params: {[getKey(index)]: value}})
        .map(({query, params}, index) =>
            ({query: `${query}${strings[index]}`, params}))

class Raw {
    constructor(string) { Object.assign(this, {string}) }

    getRawQuery() { return {query: this.string} }
}

export class Cypher {
    static defaultPrefix = 'v'

    static Raw = Raw

    static raw = string => new Cypher.Raw(string)

    static tag = (strings, ...values) => new Cypher(strings, values)

    static literal = (object, keys = Object.keys(object)) =>
        new Cypher([...keys.map(key => `${key}:`), ''], keys.map(key => object[key]))

    static cleanup = string =>
        string
            .replace(/^ *!/img, '')
            .replace(/ *$/img, '')
            .replace(/\n+/img, ' ')
            .trim()

    constructor(strings, values) { Object.assign(this, {strings, values}) }

    getRawQuery({prefix} = {prefix: Cypher.defaultPrefix},
        [prefixString, ...strings] = this.strings,
        results = getResults(index => `${prefix}${index}`, strings, this.values)) {
        return {
            query: Cypher.cleanup(results
                .map(({query}) => query)
                .reduce((s, q) => s + q, prefixString)),
            params: Object.assign({}, ...results.map(({params}) => params))
        }
    }
}
