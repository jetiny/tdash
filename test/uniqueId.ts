import test from 'ava'

import {uniqueInt, uniqueStr} from '../src/uniqueId'

test('uniqueInt', async t => {
	for (let i = 0; i < 5000; ++ i) {
		let res = uniqueInt()
		t.is(typeof res, 'number')
		t.is(res.toString().length, 16)
	}
})

test('uniqueStr', async t => {
	for (let i = 0; i < 5000; ++ i) {
		let res = uniqueStr()
		t.is(typeof res, 'string')
		t.is(res.length, 10)
	}
})
