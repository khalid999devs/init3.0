import { useEffect, useState, createContext, useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
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
  const [isNavOpen, setIsNavOpen] = useState(false)

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
  }, [navigate])

  return (
    <AdminContext.Provider
      value={{
        adminData,
        setAdminData,
        emailAndPhData,
        setEmailAndPhData,
        isNavOpen,
        setIsNavOpen,
      }}
    >
      {!isAdminLog ? (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            color: 'darkBlue.main',
            fontWeight: 600,
          }}
        >
          Loading administrator workspace…
        </Box>
      ) : (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f6f8fa' }}>
          <Navbar />
          <Box
            component='main'
            aria-label='Administrator workspace'
            sx={{
              minHeight: '100vh',
              minWidth: 0,
              ml: isNavOpen ? '220px' : '68px',
              width: isNavOpen ? 'calc(100% - 220px)' : 'calc(100% - 68px)',
              transition: 'margin-left .28s ease, width .28s ease',
              overflowX: 'hidden',
              py: 3,
              px: { xs: 1.5, md: 2.5 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      )}
    </AdminContext.Provider>
  )
}

export const AdminContextConsumer = () => {
  return useContext(AdminContext)
}

export default Admin
