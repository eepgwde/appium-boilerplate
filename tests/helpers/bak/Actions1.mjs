#!/usr/bin/env zx

// weaves

// Prototyping area

// Snippets client JS here in the Google zx on GitHub.
// You can't import. Use td-now for bigger systems.

// This makes a temporary file

function transpose(matrix) {
  return matrix.reduce((prev, next) => next.map((item, i) =>
    (prev[i] || []).concat(next[i])
  ), []);
}

const accumulate = (r,c,i) => {
  r.push((r[i-1] || 0) + c)
  return r
}

const m0 = [[1,2,3], [4,5,6], [7,8,9]]
const m1 = [['a', 'b', 'c'], ['x', 'y', 'z']]

const n0 = transpose(m0)

console.log(JSON.stringify(n0))

const n1 = transpose(m1)

console.log(JSON.stringify(n1))

const a0 = Array(5).fill(1)
const s0 = Array(5).fill('a')

console.log(JSON.stringify(a0))

const b0 = a0.reduce(accumulate, []).map( (x) => x - 1)

console.log(JSON.stringify(b0))

console.log(JSON.stringify(transpose([b0, s0])))

m0.map( (row, i) => console.log(i))


console.log(s0.map( (item, i) => [i, item]))

