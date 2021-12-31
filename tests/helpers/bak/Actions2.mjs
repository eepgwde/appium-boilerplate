#!/usr/bin/env zx

// const fs = require('fs')
const PropertiesReader = require('properties-reader');
const path = require('path')

const ddir = path.resolve('../../resources')

const files = await fs.readdirSync(ddir, (err) => { console.log(err) })

const files1 = files.filter(fn => fn.endsWith('_desc.properties')).map( fn => path.join(ddir, fn) )

// console.log(files1)

console.log(files1[0])

var properties = PropertiesReader(files1[0])

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
const kvs1 = kvs.map( x => [x[0], x[1], x[1].split(".")[1]] ).filter( x => (x[2] == "text" || x[2] == "desc") ).map(x => [ x[0], x[1] ] ).map( x => [ x[0], properties.get(x[1]) ] ).filter( x => x[1].length > 0)

const kvs2 = kvs1.sort(function(a, b) {
    return a[0].localeCompare(b[0])
});

const kvs3 = Object.fromEntries(kvs2)
const kvs4 = new Map(Object.entries(kvs3))

console.log(kvs4)


const idxes1 = [ ...Array(sections.length).keys() ]
const sections1 = idxes1.map( i => [ sections[i], (i+1).toString().padStart(2, '0') ])
const sections2 = Object.fromEntries(sections1)
const sections3 = new Map(Object.entries(sections2))

console.log(sections3)

const map0 = new Map()
for (const [key, value] of sections3) {
    map0.set(key, value.concat(" : " + kvs4.get(key)) )
}

console.log(map0)

console.log("--hello")

throw '';
