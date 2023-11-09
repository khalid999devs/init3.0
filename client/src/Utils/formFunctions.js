export const objToFormData = (obj) => {
  let fd = new FormData()

  for (let x in obj) {
    fd.append(`${x}`, obj[x])
  }
  return fd
}
