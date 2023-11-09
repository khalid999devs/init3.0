import axios from 'axios'
import reqs from '../../../data/requests'

export const submitFilesAndLinks = async (
  submitObjArr,
  modeType,
  eventValue
) => {
  if (submitObjArr.length < 1)
    return new Promise((resolve, reject) => {
      resolve({ succeed: true, msg: 'proceed' })
    })

  if (modeType === 'link') {
    let links = []
    let names = []
    submitObjArr.forEach((obj) => {
      links.push(obj.link)
      names.push(obj.name)
    })
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${reqs.SUBMIT_LINK}${eventValue}`,
          { links: links.join(','), names: names.join(',') },
          { withCredentials: true }
        )
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  } else if (modeType === 'file') {
    return new Promise(async (resolve, reject) => {
      try {
        const clearResponse = await axios.post(
          `${reqs.CLEAR_SUBMIT_INFO}${eventValue}`,
          { mode: modeType },
          { withCredentials: true }
        )
        if (clearResponse.data.succeed) {
          for (let i = 0; i < submitObjArr.length; i++) {
            const fd = new FormData()
            fd.append('submission', submitObjArr[i].file)
            const res = await axios.post(
              `${reqs.SUBMIT_FILE}${eventValue}`,
              fd,
              {
                withCredentials: true,
              }
            )
            if (!res.data.succeed) {
              resolve(res.data)
            }
          }

          resolve({
            succeed: true,
            msg: 'Successfully submitted all the files',
          })
        } else {
          resolve(clearResponse.data)
        }
      } catch (error) {
        reject(error)
      }
    })
  } else
    return new Promise((resolve, reject) => {
      resolve({ succeed: false, msg: 'wrong mode value' })
    })
}
