#!/usr/bin/env zx

// jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' test.json
var PropertiesReader = require('properties-reader');

var x0 = 'w00000001-text.properties'
x0 = 'w264eed6d-text3.properties'

var properties = PropertiesReader('../../resources/' + x0)

properties.each((key, value) => {
  // called for each item in the reader,
  // first with key=main.some.thing, value=foo
  // next with key=blah.some.thing, value=bar
  console.log(key + "; " + value)
});

$`exit 0`

// Early prototype

class Actions0 {
    constructor(mesg) {
	const actions = new Array(mesg.length);

	const chars = Array.from(mesg)
	const k1 = chars.map( v => [ (this.keyPress(v, "keyDown")), (this.keyPress(v, "keyUp")) ]).flat()
	const k2 = this.keyActions(k1)
	this.actions = [ k2 ]
    }

    keyPress(ch, dir) {
	return {
	    type : dir,
	    value : ch
	}
    }

    keyActions(ks) {
	return {
	    type : "key",
	    actions : [ ks ],
	    id : "default keyboard"
	}
    }

}

const mesg = "user@name"

const k3 = new Actions0(mesg)



fs.writeFileSync("./t.json", JSON.stringify(k3));

// console.log(`actions: ${JSON.stringify(k2)}`)

