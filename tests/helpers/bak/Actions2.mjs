#!/usr/bin/env zx

// const fs = require('fs')
const PropertiesReader = require('properties-reader');
const path = require('path')

console.log(process.cwd())

console.log('hello')

const ddir = path.resolve('../../resources')

const files = await fs.readdirSync(ddir, (err) => { console.log(err) })

const files1 = files.filter(fn => fn.endsWith('_desc.properties')).map( fn => path.join(ddir, fn) )

// console.log(files1)

console.log(files1[0])

let values = files1.map(fn => [ PropertiesReader(fn).get('hashCode'), fn ])

let map0 = Object.fromEntries(values)

console.log(map0)

var properties = PropertiesReader(files1[0])

console.log(properties.get("hashCode"))

if (1==0) {
    properties.each((key, value) => {
	// called for each item in the reader,
	// first with key=main.some.thing, value=foo
	// next with key=blah.some.thing, value=bar
	console.log(key + "; " + value)
    });
}

// console.log(files)

throw '';


