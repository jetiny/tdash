import test from 'ava'
const {expect} = require('chai')
import * as type from '../src/types'

test('type', (t) => {
  interface Objects {
    [key:string]: any;
  }
  const items : Objects = {
    'Object': {},
    'Array': [],
    'Nan': NaN,
    'Undefined': undefined,
    'Boolean': true,
    'Number': 1.0,
    'String': '',
    'Function': function () {},
    'RegExp': /text/,
    'Date': new Date()
  }
  interface Types {
    [key:string]: (v: any) => boolean ;
  }
  let types: Types = <Types><any>type
  Object.keys(items).forEach((name) => {
    // items
    Object.keys(items).forEach((key) => {
      let ret = types['is' + name](items[key])
      expect(ret).to.eql(name === key)
    })
  })
  t.pass()
})

test('isType', async (t) => {
  expect(type.isNull(null)).to.eql(true)
  expect(type.isUint(5)).to.eql(true)
//   expect(type.isAsync(async () => {})).to.eql(true) // typescript 失败
  expect(type.isPromise(Promise.resolve())).to.eql(true)
  t.pass()
})

test('typeName', async (t) => {
  expect(type.typeName(5)).to.eql('Number')
  expect(type.typeName(undefined)).to.eql('Undefined')
  expect(type.typeName(null)).to.eql('Null')
  expect(type.typeName(NaN)).to.eql('Nan')
  t.pass()
})