#!/usr/bin/env zx

// weaves

// Prototyping area

// Snippets client JS here in the Google zx on GitHub.
// You can't import. Use td-now for bigger systems.

// This makes a temporary file

const tmp = require('tmp');
const path = require('path');

let v0 = path.parse("/this/that/those.it").toString()

console.log(v0.dir)

String.prototype.hashCode = function() {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// let v1 = v0.dir.hashCode().toString(16)
let v1 = "message"
let v2 = "message".hashCode().toString(16)

console.log(v2.toString())

let p0 = path.join(".", "/pages/", "w-" + v2)

console.log(p0.toString())

const fname = tmp.fileSync({ mode: 0o644, prefix: 'prefix-', postfix: '.xml', tmpdir: '.' },
	   function _tempFileCreated(err, path, fd) {
  if (err) throw err;

  console.log('File: ', path);
  console.log('Filedescriptor: ', fd);
});

console.log('fname: ' + fname.name)

