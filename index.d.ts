declare module "cypher-talker" {
    export default function cypher(arg: string | {[key: string]: any}): [string, {[key: string]: any}]
    export default function cypher(arg1: TemplateStringsArray, ...args: any): [string, {[key: string]: any}]
}
