import test from 'ava'
const path = require('path')

import { existsAsync, existsSync, writeFileAsync, removeFileAsync, copyFileAsync, readDirAsync, moveFileAsync } from '../src/fse'

test('fse', async t => {
    const fileDir  = path.join(__dirname, './fixtures')
    const filePath = path.join(__dirname, './fixtures/fse.txt')
    const filePathDest = filePath + '.md'
    await removeFileAsync(filePath)
    t.is(await writeFileAsync(filePath, "str"), filePath)
    t.is(await existsAsync(filePath), true)
    t.is(await copyFileAsync(filePath, filePathDest), filePathDest)
    t.is(await removeFileAsync(filePath), filePath)
    t.is(existsSync(filePath), false)
    t.is(existsSync(filePathDest), true)
    t.is((await readDirAsync(fileDir)).length > 1, true)
    t.is((await readDirAsync(fileDir, {join: true})).length> 1, true)
    t.is((await readDirAsync(fileDir, {fullPath: true})).length> 1, true)
    const n = (await readDirAsync(fileDir, {fullPath: true, join: true})).length
    t.is(n > 1, true)
    t.is(n - (await readDirAsync(fileDir, {exclude: '.gitkeep'})).length, 1)
    let e = null
    try {
        await readDirAsync('no_exists_dir')
    } catch (err) {
        e = err
    }
    t.is(!!e, true)
    e = null
    try {
        await moveFileAsync(filePath, filePathDest)
    } catch (err) {
        e = err
    }
    t.is(!!e, true)
    t.is(Object.keys(await readDirAsync(fileDir, {join: true, map: true})).length > 1, true)
    await moveFileAsync(filePathDest, filePath)
    await removeFileAsync(filePath)
})
