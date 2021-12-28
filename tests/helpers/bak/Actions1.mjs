#!/usr/bin/env zx

// weaves

// Prototyping area

// Snippets client JS here in the Google zx on GitHub.
// You can't import. Use td-now for bigger systems.

// This makes a temporary file

const tmp = require('tmp');

const fname = tmp.fileSync({ mode: 0o644, prefix: 'prefix-', postfix: '.xml', tmpdir: '.' },
	   function _tempFileCreated(err, path, fd) {
  if (err) throw err;

  console.log('File: ', path);
  console.log('Filedescriptor: ', fd);
});

console.log('fname: ' + fname.name)

