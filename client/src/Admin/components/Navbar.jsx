import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoutOutlined, MenuBookOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { navitems } from '../../data/admin'
import styled from '@emotion/styled'
import { AdminContextConsumer } from '../pages/Admin'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import axios from 'axios'
import reqs from '../../data/requests'

const StyledMenuLink = styled(ListItem)({
  margin: '3px',
})

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const location = useLocation()
  const { adminData } = AdminContextConsumer()
  const navigate = useNavigate()

  useEffect(() => {}, [location.pathname])

  const handleLogout = () => {
    axios
      .get(reqs.ADMIN_LOGOUT, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          navigate('/adminLogin', { replace: true })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Box
      sx={{
        zIndex: '1000',
        backgroundColor: 'primary.main',
        position: 'fixed',
        height: '100vh',
        transition: '.5s all ease',
        transform: `translateX(${isNavOpen ? '0%' : '-70%'})`,
      }}
    >
      <Box
        sx={{
          color: 'info.light',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          paddingRight: '5px',
        }}
      >
        <IconButton
          sx={{
            color: 'info.light',
          }}
          aria-label='open-close'
          size='large'
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? (
            <CloseOutlinedIcon sx={{ fontSize: '2rem' }} />
          ) : (
            <MenuBookOutlined sx={{ fontSize: '2rem' }} />
          )}
        </IconButton>
      </Box>

      <Box
        sx={{
          padding: '10px',
          margin: '5px 5px',
        }}
      >
        <Avatar
          sx={{ bgcolor: 'info.main', color: 'darkblue', marginBottom: '10px' }}
        >
          {adminData.userName.slice(0, 1).toUpperCase()}
        </Avatar>
        <Typography
          variant='p'
          sx={{ fontSize: '1.2rem' }}
          color={'primary.light'}
        >
          {adminData.userName}
        </Typography>
      </Box>
      <List
        sx={{
          height: '100%',
        }}
      >
        {navitems.map((item, value) => {
          return (
            <StyledMenuLink key={value} disablePadding>
              <Link
                style={{
                  textDecoration: 'none',
                }}
                to={item.to}
              >
                <ListItemButton
                  sx={{
                    color: 'info.main',
                    '&:hover': {
                      backgroundColor: 'secondary.main',
                    },
                    backgroundColor:
                      location.pathname === `/admin/${item.to}` ||
                      location.pathname === item.to
                        ? 'secondary.main'
                        : '',
                  }}
                >
                  <ListItemText
                    sx={{
                      width: '100px',
                    }}
                    primary={item.title}
                  />
                  <ListItemIcon
                    sx={{
                      color: 'info.main',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Link>
            </StyledMenuLink>
          )
        })}

        {/* logout */}
        <StyledMenuLink disablePadding>
          <ListItemButton
            sx={{
              color: 'info.main',
              '&:hover': {
                backgroundColor: 'secondary.main',
              },
            }}
            onClick={handleLogout}
          >
            <ListItemText
              sx={{
                width: '100px',
              }}
              primary={'Logout'}
            />
            <ListItemIcon
              sx={{
                color: 'info.main',
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: '5px',
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>
          </ListItemButton>
        </StyledMenuLink>
      </List>
    </Box>
  )
}

export default Navbar
