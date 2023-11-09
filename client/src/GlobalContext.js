import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import reqs, { reqImgWrapper } from './data/requests'
import Loader from './Loader'

const AppContext = createContext()

export const GlobalContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [appSetting, setAppSetting] = useState({
    title: 'FTMPC 3.0',
    phones: '+8801517-830228',
    gmails: 'nditc.official@gmail.com',
    titleDesc: `In this age, where information has become synonymous with power; with technology as its driving force, the need for a club in Notre Dame College for the young tech enthusiasts couldn't be more. You asked for it. We made it happen.`,
    image: '',
    intro: '',
    caRegPermit: true,
  })

  // const setMeta = (selector, content) => {
  //   document.querySelector(selector).setAttribute('content', content)
  // }

  // const setAllMetaData = (data) => {
  //   if (data) {
  //     document.title = data.title
  //     setMeta('meta[property="og:image"]', reqImgWrapper(data.image))
  //     setMeta('meta[property="og:title"]', data.title)
  //     setMeta('meta[name="twitter:image:alt"]', data.title)
  //     setMeta('meta[property="og:description"]', data.titleDesc)
  //   }
  // }

  useEffect(() => {
    // setMeta('meta[property="og:url"]', window.location.href)
    axios
      .get(reqs.EVENT_SETTING)
      .then((res) => {
        let resultArr = []
        if (res.data.succeed) {
          resultArr = res.data.result
          if (resultArr.length > 0) setAppSetting(res.data.result[0])
        }
        // setAllMetaData(resultArr.length > 0 ? res.data.result[0] : undefined)
        setLoading(false)
        return axios.get(reqs.ALL_EVENTS)
      })
      .then((res) => {
        if (res.data.succeed) {
          setEvents(res.data.result)
        }
      })
      .catch((err) => {
        // console.log(err.response)
        setLoading(false)
      })
  }, [])

  return (
    <AppContext.Provider
      value={{
        events,
        setEvents,
        appSetting,
        setAppSetting,
      }}
    >
      <Loader loading={loading} />
      {children}
    </AppContext.Provider>
  )
}

export const GlobalContextConsumer = () => {
  return useContext(AppContext)
}
