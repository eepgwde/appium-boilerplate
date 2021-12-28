#!/usr/bin/env zx

// Early prototype of Actions0 now in Sources0

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

