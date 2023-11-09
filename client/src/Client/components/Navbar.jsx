import styled from '@emotion/styled'
import { IconButton, Stack, Typography, Box, keyframes } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import UserAv from './Home/UserAv'
import { navigationLinks } from '../../data/client'
import MobileNav from './Navbar/MobileNav'
import { GlobalContextConsumer } from '../../GlobalContext'
import Submenu from './Navbar/Submenu'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import reqs from '../../data/requests'
import { theme } from '../../customStyles/theme'

export const glowEffect = keyframes`
  0%{
    height: 1px;
  color: ${theme.palette.semiWhite.main};
    transform: scale(1);

  }
  50%{
    color: ${theme.palette.info.main};
    height: 2.5px;
    transform: scale(1.09);

    
  }
  100%{
 color: ${theme.palette.semiWhite.main};
    height: 1px;
    transform: scale(1);


  }
`

const StyledNav = styled('nav')(({ theme }) => ({
  display: 'flex',
  height: 'min-content',
  color: theme.palette.info.light,
  marginTop: theme.spacing(1.5),
  position: 'relative',
}))

const StyledMenuItems = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontFamily: `'Titillium Web', sans-serif`,
  position: 'relative',
  color: theme.palette.semiWhite.main,
  textTransform: 'uppercase',
  [theme.breakpoints.up('md')]: {
    fontSize: '.95rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1rem',
  },
  letterSpacing: '1px',
  width: 'fit-content',
  '&::after': {
    content: `''`,
    position: 'absolute',
    top: '0',
    left: '-5%',
    opacity: '.4',
    width: '0',
    height: '100%',
    background: 'transparent',
    border: `0px solid ${theme.palette.info.main}`,

    transition: `.3s all ${theme.transitions.easing.cubic1}`,
  },
  '&:hover::after': {
    width: '60%',
    borderWidth: '1px',
  },
  '&.glow': {
    animation: `${glowEffect} 2000ms ease infinite`,
  },
}))

const navBarEffect = keyframes`
  0%{
    height: 1px;
    background-color: ${theme.palette.semiWhite.main};
    transform: scale(1);
  }
  50%{
    background-color: ${theme.palette.info.main};
    height: 2.5px;
    transform: scale(1.05);
  }
  100%{
    background-color: ${theme.palette.semiWhite.main};
    height: 1px;
    transform: scale(1);
  }
`

const StyledSpan = styled('span')(({ theme }) => ({
  height: '1px',
  width: '30px',
  backgroundColor: theme.palette.semiWhite.main,
  border: 'none',
  position: 'relative',
  userSelect: 'none',
  animation: `${navBarEffect} 3000ms ease infinite`,
  '&::after,&::before': {
    content: `''`,
    position: 'absolute',
    right: '0',
    backgroundColor: theme.palette.semiWhite.main,
    height: '100%',
    transition: '.15s linear all',
    animation: `${navBarEffect} 3000ms ease infinite`,
  },
  '&::after': {
    top: '6px',
    width: '80%',
  },
  '&::before': {
    top: '12px',
    width: '50%',
  },
}))

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    appSetting: { caRegPermit },
  } = GlobalContextConsumer()
  const [isUp, setIsUp] = useState(false)
  const [isNavModal, setIsNavModal] = useState(false)
  const [eventLoad, setEventLoad] = useState(true)
  const [categorizedEvents, setCategorizedEvents] = useState([])
  //submenu states
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [page, setPage] = useState({ page: '', links: [] })
  const [subMenuLocation, setSubMenuLocation] = useState({})
  const [spMode, setSpMode] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > 300) isUp === false && setIsUp(true)
    else isUp && setIsUp(false)
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isUp])

  const categorizeEvents = (events) => {
    let arrangedEvents = []
    const categories = [...new Set(events.map((event) => event.category))]
    categories.forEach((uniqueCategory) => {
      events.forEach((event) => {
        if (event.category === uniqueCategory)
          arrangedEvents.push({
            title: event.name,
            link: `event/${event.value}`,
            sub: false,
            category: uniqueCategory,
          })
      })
    })
    setCategorizedEvents(arrangedEvents)
  }

  //categorized events
  useEffect(() => {
    axios
      .get(`${reqs.ALL_EVENTS}?value=1`)
      .then((res) => {
        if (res.data.succeed) categorizeEvents(res.data.result)
        setEventLoad(false)
      })
      .catch((err) => {
        setEventLoad(false)
      })
  }, [])

  const openSubmenu = (text, coordinates) => {
    const motherLink = navigationLinks.find((item) => item.title === text)
    setPage({
      page: motherLink.title,
      links:
        motherLink.title === 'Events' ? categorizedEvents : motherLink.childs,
    })
    setSubMenuLocation(coordinates)
    setIsSubmenuOpen(true)
  }
  const closeSubmenu = () => {
    setIsSubmenuOpen(false)
  }

  const handleSubmenu = (e) => {
    if (!e.target.classList.contains('mother-link')) {
      closeSubmenu()
    }
  }

  const displaySubmenu = (e) => {
    const page = e.target.textContent
    const tempBtn = e.target.getBoundingClientRect()
    const center = (tempBtn.left + tempBtn.right) / 2
    const bottom = tempBtn.bottom
    openSubmenu(page, { center, bottom })
  }

  return (
    <Stack
      sx={{
        position: 'fixed',
        zIndex: '999',
        transition: '.3s ease all',
        background:
          isUp === true || location.pathname !== '/'
            ? (theme) => theme.palette.primary.main
            : 'transparent',
        boxShadow: isUp === true && `1px 1px 0px  1px rgba(0,0,0,.8)`,
      }}
      width='100%'
      justifyContent={'space-between'}
      flexDirection='row'
    >
      {/* for img */}
      <Box
        sx={{
          maxWidth: '150px',
          maxHeight: '50px',
          overflow: 'hidden',
          transform: {
            xs: 'translate(-25%,8%)',
            sm: 'translate(-15%,6%)',
            lg: 'translate(0,5%)',
          },
          cursor: 'pointer',
        }}
        onClick={() => {
          navigate('/', { replace: true })
        }}
      >
        <LazyLoadImage
          style={{ objectFit: 'cover', transform: 'scale(.5)' }}
          height='100%'
          width='100%'
          effect='blur'
          src='/Images/INIT3.png'
          alt='Logo'
        />
      </Box>

      {/* for text logo */}
      {/* <Box
        sx={{
          maxWidth: '150px',
          height: '50px',
          overflow: 'hidden',
          cursor: 'pointer',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => {
          navigate('/', { replace: true })
        }}
      >
        <Typography
          sx={{
            fontSize: '1.4rem',
            fontWeight: 900,
            color: 'semiWhite.main',
            fontFamily: `'Titillium Web', sans-serif`,
            letterSpacing: '2px',
            userSelect: 'none',
          }}
          component={'span'}
        >
          FTMPC
        </Typography>
      </Box> */}

      {/* nav menus */}
      <Stack
        justifyContent='space-between'
        sx={{
          flexDirection: {
            xs: 'row-reverse',
            md: 'row',
          },
          paddingLeft: {
            xl: '15px',
          },
          display: { xs: 'none', md: 'flex' },
          minWidth: (theme) => ({
            xl: theme.breakpoints.values.lg,
            lg: theme.breakpoints.values.md,
            md: theme.breakpoints.values.sm,
          }),
        }}
      >
        <StyledNav onMouseOver={handleSubmenu}>
          {navigationLinks.slice(0, 7).map((item, key) => {
            return (
              <Typography
                key={key}
                width={'max-content'}
                sx={{ padding: '0 8px' }}
                className={item.sub === true ? ' mother-link' : ''}
                onMouseOver={(e) => {
                  if (item.sub === true) {
                    displaySubmenu(e)
                  }
                }}
              >
                <StyledMenuItems
                  to={item.link || '#'}
                  className={`${
                    (location.pathname === item.link ||
                      location.pathname === `/${item.link}`) &&
                    item.link &&
                    'activeMenu'
                  }${item.sub === true ? ' mother-link' : ''} ${
                    item.title === 'Events' ? 'glow' : ''
                  }`}
                >
                  {item.title}
                </StyledMenuItems>
              </Typography>
            )
          })}
          {navigationLinks.length > 7 && (
            <IconButton
              color='semiWhite'
              sx={{
                padding: '0',
                transition: '.3s ease all',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => {
                setSpMode(true)
                setIsNavModal(true)
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </StyledNav>
      </Stack>
      <Stack
        justifyContent={'flex-end'}
        columnGap={1}
        flexDirection={'row'}
        alignItems={'center'}
        sx={{
          mr: {
            xs: 1,
            md: 3,
            lg: 4,
          },
          minWidth: '100px',
          width: 'max-content',
        }}
      >
        <IconButton
          sx={{
            color: 'semiWhite.light',
            transition: '.3s ease all',
            display: {
              xs: 'flex',
              md: 'none',
            },
            '&:hover': {
              color: 'semiWhite.main',
            },
          }}
          onClick={() => navigate('/notices')}
        >
          <NotificationsNoneIcon sx={{ fontSize: '1.8rem' }} />
        </IconButton>
        <UserAv />
        <IconButton
          sx={{
            display: {
              sm: 'flex',
              md: 'none',
            },
            alignItems: 'flex-start',
            padding: 0,
            height: '25px',
            padding: '5px',
            '&:hover span::after,&:hover span::before': {
              width: '100%',
            },
          }}
          onClick={() => setIsNavModal(true)}
        >
          <StyledSpan></StyledSpan>
        </IconButton>
      </Stack>

      {/* subMenus */}
      <Submenu
        isSubmenuOpen={isSubmenuOpen}
        page={page}
        subMenuLocation={subMenuLocation}
        closeSubmenu={closeSubmenu}
        caRegPermit={caRegPermit}
        eventLoad={eventLoad}
      />

      {/* nav modal */}
      <MobileNav
        open={isNavModal}
        handleClose={() => {
          setIsNavModal(false)
          if (spMode === true) {
            setSpMode(false)
          }
        }}
        spMode={spMode}
        navigationLinks={navigationLinks}
        categorizedEvents={categorizedEvents}
        eventLoad={eventLoad}
      />
    </Stack>
  )
}

export default Navbar
