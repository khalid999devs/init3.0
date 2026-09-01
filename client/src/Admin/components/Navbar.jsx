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
  const location = useLocation()
  const { adminData, isNavOpen, setIsNavOpen } = AdminContextConsumer()
  const navigate = useNavigate()

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
        top: 0,
        left: 0,
        width: '220px',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'transform .28s ease',
        transform: isNavOpen
          ? 'translateX(0)'
          : 'translateX(calc(-100% + 68px))',
        boxShadow: isNavOpen ? '8px 0 24px rgba(20, 24, 38, .14)' : 'none',
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
          aria-expanded={isNavOpen}
          title={isNavOpen ? 'Collapse navigation' : 'Expand navigation'}
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
          minHeight: '112px',
        }}
      >
        <Avatar
          sx={{ bgcolor: 'info.main', color: 'darkblue', marginBottom: '10px' }}
        >
          {adminData.userName.slice(0, 1).toUpperCase()}
        </Avatar>
        <Typography
          component='p'
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
                  width: '100%',
                }}
                to={item.to}
              >
                <ListItemButton
                  sx={{
                    minHeight: '52px',
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
                      width: '112px',
                      flexShrink: 0,
                    }}
                    primary={item.title}
                  />
                  <ListItemIcon
                    sx={{
                      color: 'info.main',
                      minWidth: '40px',
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
              minHeight: '52px',
              color: 'info.main',
              '&:hover': {
                backgroundColor: 'secondary.main',
              },
            }}
            onClick={handleLogout}
          >
            <ListItemText
              sx={{
                width: '112px',
                flexShrink: 0,
              }}
              primary={'Logout'}
            />
            <ListItemIcon
              sx={{
                color: 'info.main',
                minWidth: '40px',
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
