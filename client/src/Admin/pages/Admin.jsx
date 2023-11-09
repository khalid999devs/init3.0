import { useEffect, useState, createContext, useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { GlobalContextConsumer } from '../../GlobalContext'
import axios from 'axios'
import reqs from '../../data/requests'
import Navbar from '../components/Navbar'

const AdminContext = createContext()

const Admin = () => {
  const navigate = useNavigate()

  const [isAdminLog, setIsAdminLog] = useState(false)
  const [adminData, setAdminData] = useState({
    userName: 'Event',
    id: 1,
  })

  const [emailAndPhData, setEmailAndPhData] = useState({
    email: {},
    phone: {},
  })

  useEffect(() => {
    axios
      .get(reqs.IS_ADMIN_LOGGED, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setIsAdminLog(true)
          setAdminData(res.data.result)
        } else {
          setIsAdminLog(false)
          navigate('/adminLogin')
        }
      })
      .catch((err) => {
        navigate('/adminLogin')
      })
  }, [])

  return (
    <AdminContext.Provider
      value={{ adminData, setAdminData, emailAndPhData, setEmailAndPhData }}
    >
      {!isAdminLog ? (
        <div>Loading</div>
      ) : (
        <div>
          <Navbar />
          <Outlet />
        </div>
      )}
    </AdminContext.Provider>
  )
}

export const AdminContextConsumer = () => {
  return useContext(AdminContext)
}

export default Admin
