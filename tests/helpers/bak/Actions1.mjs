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

const m0 = [[1,2,3], [4,5,6], [7,8,9]]
const m1 = [['a', 'b', 'c'], ['x', 'y', 'z']]

const n0 = transpose(m0)

console.log(JSON.stringify(n0))

const n1 = transpose(m1)

console.log(JSON.stringify(n1))

const a0 = Array(5).fill(1)
const t0 = Array(5).fill('a')

console.log(JSON.stringify(a0))

const acc1 = (r,c,i) => {
  r.push((r[i-1] || 0) + c)
  return r
}

const b0 = a0.reduce(acc1, []);

console.log(JSON.stringify([ b0, t0]))

const c0 = transpose([b0, t0])

console.log(JSON.stringify(c0))

const faccumulate = (c0= 0) => (r, c, i) => {
  r.push((r[i-1] || c0) + c)
  return r
}

const facci0 = faccumulate(0)
const faccsb = faccumulate('b')

console.log(JSON.stringify(a0.reduce(facci0, [])))

console.log(JSON.stringify(t0.reduce(faccsb, [])))

