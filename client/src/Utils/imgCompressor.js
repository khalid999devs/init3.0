import imageCompression from 'browser-image-compression'

export async function handleCompressImg(imageFile, maxSize, widthOrHeight) {
  // console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
  // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)

  const options = {
    maxSizeMB: maxSize,
    maxWidthOrHeight: widthOrHeight,
    useWebWorker: true,
  }
  try {
    const compressedFile = await imageCompression(imageFile, options)
    // console.log(
    //   'compressedFile instanceof Blob',
    //   compressedFile instanceof Blob
    // ) // true
    // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`) // smaller than maxSizeMB

    return compressedFile // write your own logic
  } catch (error) {
    console.log(error)
  }
}
