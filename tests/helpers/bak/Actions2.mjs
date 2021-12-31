#!/usr/bin/env zx

// const fs = require('fs')
const PropertiesReader = require('properties-reader');
const path = require('path')

const ddir = path.resolve('../../resources')

const files = await fs.readdirSync(ddir, (err) => { console.log(err) })

const files1 = files.filter(fn => fn.endsWith('_desc.properties')).map( fn => path.join(ddir, fn) )

// console.log(files1)

console.log(files1[0])

// I have 12 buttons, it is only six from $$()
const ch0 = path.join(ddir, 'w509bd21d_desc.properties')

var properties = PropertiesReader(ch0)

console.log(properties.get("hashCode"))
console.log(properties.length)

// clickable is:
//
// clk.text.{part}.*
// clk.desc.{part}.*
// txt.text.{part}.*
// txt.desc.{part}.*
// A 

function ftags(part) {
    const t0 = [ `clk.text.${part}`, `clk.desc.${part}`, `txt.text.${part}`, `txt.desc.${part}` ]
    return t0
}

const idxes = [...Array(40).keys()].map(v => (v+1).toString().padStart(2,'0'))

var sections = []
properties.each((key, value) => {
    const section = key.split(".")[2]
    // ignore the header
    if (typeof section == 'string') {
	if (!sections.includes(section)) {
	    sections.push(section)
	}
    }
})

const parts = sections.map( v => ftags(v))

const props = properties.getAllProperties()

const keys = Object.keys(props)

const kvs = keys.filter(k => k.split(".").length > 3).map( k => [k.split(".")[2], k] )

const kvs10 = kvs.map( x => [x[0], x[1], x[1].split(".")[1]] ).filter( x => (x[2] == "text" || x[2] == "desc") ).map(x => [ x[0], x[1] ] ).map( x => [ x[0], properties.get(x[1]) ] )

const kvs1 = kvs.map( x => [x[0], x[1], x[1].split(".")[1]] ).filter( x => (x[2] == "text" || x[2] == "desc") ).map(x => [ x[0], x[1] ] ).map( x => [ x[0], properties.get(x[1]) ] ).filter( x => x[1].length > 0)

console.log('kvs')
console.log(kvs)

console.log('kvs10')
console.log(kvs10)

const kvs2 = kvs10.sort(function(a, b) {
    return a[0].localeCompare(b[0])
});


console.log(kvs2)

function groupBy(arr, idx) {
    return arr.reduce(function(acc, obj) {
	let key=obj[idx]
	if (!acc[key]) {
	    acc[key] = []
	}
	acc[key].push(obj)
	return acc
    }, {})
}

const v0 = groupBy(kvs2, 0)

const kvs4 = new Map(Object.entries(v0))

console.log(kvs4)


throw '';
