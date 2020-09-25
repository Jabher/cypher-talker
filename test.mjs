import test from 'ava'
import tag from './index.mjs'

test('cypher tag', (t) => {
  t.deepEqual([...tag`test`], ['test', {}])
  t.deepEqual([...tag`test${'testVar'}`], ['test$v0', { v0: 'testVar' }])
  t.deepEqual([...tag`test${tag('inline')}`], ['testinline', {}])
  t.deepEqual([...tag`test0${tag`test1${'testVar'}${'testVar2'}`}${'testVar3'}`], ['test0test1$v0$v1$v2', {
    v0: 'testVar',
    v1: 'testVar2',
    v2: 'testVar3',
  }])
  t.deepEqual([...tag`test(${tag({foo: 'bar'})})`], ['test(foo:$v0)', {
    v0: 'bar'
  }])
})
