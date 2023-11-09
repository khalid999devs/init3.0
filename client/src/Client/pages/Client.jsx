import { createContext, useContext, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import reqs from '../../data/requests'

const ClientContext = createContext()

const Client = () => {
  const [clientProfile, setClientProfile] = useState({
    id: null,
    userName: null,
    mode: null,
    fullName: null,
    clientEvents: [],
    email: null,
    phone: null,
  })
  const [triggerAv, setTriggerAv] = useState(false)
  const [clientDataLoad, setClientDataLoad] = useState(null)

  const clearClientProfile = () => {
    setClientProfile({
      id: null,
      userName: null,
      mode: null,
      fullName: null,
      clientEvents: [],
      email: null,
      phone: null,
    })
  }

  useEffect(() => {
    setClientDataLoad(true)
    axios
      .get(reqs.LOGGED_CLIENT, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) setClientProfile(res.data.result)
        setClientDataLoad(false)
      })
      .catch((_) => {
        setClientDataLoad(false)
      })
  }, [triggerAv])

  return (
    <ClientContext.Provider
      value={{
        clientProfile,
        setClientProfile,
        triggerAv,
        setTriggerAv,
        clearClientProfile,
        clientDataLoad,
      }}
    >
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    </ClientContext.Provider>
  )
}

export const ClientContextConsumer = () => {
  return useContext(ClientContext)
}

export default Client
