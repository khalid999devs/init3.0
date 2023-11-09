const fileTypes = /jpeg|jpg|png|JPG|JPEG|PNG/

export const checkFiles = (fileObjArr) => {
  let status = 'ok'
  for (let i = 0; i < fileObjArr.length; i++) {
    const singleObj = fileObjArr[i]

    if (singleObj.file.name) {
      if (singleObj.name === 'image') {
        if (!fileTypes.test(singleObj.file.name)) {
          status = `unsupported format file was entered in ${singleObj.name} file field. Please upload the correct formated file`
          break
        }
      } else if (!singleObj.file.name.includes(singleObj.name)) {
        status = `unsupported format file was entered in ${singleObj.name} file field. Please upload the correct formated file`
        break
      }
    } else {
      status = `${singleObj.name} file field should not be empty`
      break
    }
  }
  return status
}
