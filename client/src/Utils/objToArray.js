export function objToArray(obj) {
  let arr = []
  for (let x in obj) {
    arr.push({ name: x, value: obj[x] })
  }
  return arr
}

export function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}
