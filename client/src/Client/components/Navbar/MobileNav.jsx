import {
  Box,
  IconButton,
  keyframes,
  Modal,
  Slide,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import { theme } from '../../../customStyles/theme'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import HomeSharpIcon from '@mui/icons-material/HomeSharp'
import { GlobalContextConsumer } from '../../../GlobalContext'
import { glowEffect } from '../Navbar'

const StyledMenuItems = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontFamily: `'Titillium Web', sans-serif`,
  position: 'relative',
  color: theme.palette.semiWhite.light,
  textTransform: 'uppercase',
  width: 'max-content',
  fontSize: '1.6rem',
  padding: '2%',
  [theme.breakpoints.up('lg')]: {
    fontSize: '2rem',
  },
  letterSpacing: '1px',
  '&::after': {
    content: `''`,
    position: 'absolute',
    top: '0',
    left: '0%',
    opacity: '.4',
    width: '0',
    height: '100%',
    background: 'transparent',
    border: `0px solid ${theme.palette.info.main}`,

    transition: `.3s all ${theme.transitions.easing.cubic1}`,
  },
  '&:hover::after': {
    width: '100%',
    borderWidth: '1px',
  },
  '& .glow': {
    color: theme.palette.semiWhite.main,
    animation: `${glowEffect} 2000ms ease infinite`,
  },
}))

const MobileNav = ({
  open,
  handleClose,
  navigationLinks,
  categorizedEvents,
  spMode,
  eventLoad,
}) => {
  const {
    appSetting: { caRegPermit },
  } = GlobalContextConsumer()
  const location = useLocation()
  const [subMenus, setSubMenus] = useState({
    state: false,
    item: {},
  })

  useEffect(() => {
    if (
      subMenus.state === true &&
      subMenus.item.title === 'Events' &&
      categorizedEvents.length > 0
    ) {
      setSubMenus((subMenus) => {
        return {
          ...subMenus,
          item: { ...subMenus.item, childs: categorizedEvents },
        }
      })
    }
  }, [eventLoad, subMenus.state])

  const handleFullClose = () => {
    handleClose()
    subMenus.state === true && setSubMenus({ state: false, item: {} })
  }

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: {
          xs: 'block',
          md: spMode === false ? 'none' : 'block',
        },
      }}
    >
      <Slide
        direction='left'
        in={open}
        mountOnEnter
        unmountOnExit
        timeout={600}
        easing={{
          enter: theme.transitions.easing.cubic1,
          exit: theme.transitions.easing.sharp,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxHeight: '100vh',
            height: '100%',
            overflow: 'auto',
            backgroundColor: 'primary.main',
          }}
        >
          {subMenus.state === true && (
            <IconButton
              sx={{
                position: 'absolute',
                top: '2%',
                left: '5%',
                boxShadow: '1px 1px 2px 1px rgba(0,0,0,.4)',
                borderRadius: 0,
                '&:hover': {
                  boxShadow: '1px 1px 2px -1px rgba(0,0,0,.3)',
                  backgroundColor: 'primary.main',
                },
                backgroundColor: 'primary.main',
                zIndex: '1',
              }}
              onClick={() => setSubMenus({ state: false, item: {} })}
            >
              <HomeSharpIcon sx={{ fontSize: '2rem', color: 'info.light' }} />
            </IconButton>
          )}
          {/* close icon */}
          <IconButton
            sx={{
              position: 'absolute',
              top: '2%',
              right: '5%',
              boxShadow: '1px 1px 2px 1px rgba(0,0,0,.4)',
              borderRadius: 0,
              '&:hover': {
                boxShadow: '1px 1px 2px -1px rgba(0,0,0,.3)',
                backgroundColor: 'primary.main',
              },
              backgroundColor: 'primary.main',
              zIndex: '1',
            }}
            onClick={handleFullClose}
          >
            <CloseOutlinedIcon sx={{ fontSize: '2rem', color: 'info.light' }} />
          </IconButton>
          {subMenus.state === false && (
            <Stack
              sx={{
                maxWidth: 'fit-content',
                margin: '0 auto',
                height: '100%',
                rowGap: { xs: 2, md: 2.5 },
              }}
              justifyContent='center'
            >
              {navigationLinks.map((item, key) => {
                return (
                  <StyledMenuItems
                    key={key}
                    to={item.link || '#'}
                    className={`${
                      (location.pathname === item.link ||
                        location.pathname === `/${item.link}`) &&
                      item.link &&
                      'activeMobileMenu'
                    }`}
                    onClick={() => {
                      if (item.sub === true) {
                        setSubMenus({ state: true, item: item })
                      } else {
                        handleFullClose()
                      }
                    }}
                  >
                    <span className={item.title === 'Events' ? 'glow' : ''}>
                      {item.title}
                    </span>
                  </StyledMenuItems>
                )
              })}
            </Stack>
          )}

          {/* submenus */}
          {subMenus.state === true && (
            <Stack
              justifyContent={'center'}
              sx={{
                margin: '0 auto',
                maxWidth:
                  subMenus.item.childs &&
                  (subMenus.item.childs.length > 3 ? '350px' : 'fit-content'),
                width: '100%',
                height: 'max-content',
                rowGap: 4,
                paddingTop: '150px',
                paddingLeft: 2,
              }}
            >
              <Typography
                color={'info.light'}
                fontSize={'1.7rem'}
                fontFamily={`'Titillium Web', sans-serif`}
                textTransform={'uppercase'}
                fontWeight={'600'}
                letterSpacing={'1px'}
              >
                {subMenus.item.title || 'Submenu'}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    subMenus.item.childs &&
                    (subMenus.item.childs.length > 3 ? '1fr 1fr' : '1fr'),
                  gap: 1,
                  columnGap: 2,
                  width: '100%',
                  pl: 1,
                }}
              >
                {subMenus.item.childs &&
                  subMenus.item.childs.map((subItem, key) => {
                    if (subItem.title === 'CA' && caRegPermit === false)
                      return ''
                    return (
                      <Link
                        key={key}
                        style={{ width: 'fit-content', textDecoration: 'none' }}
                        to={subItem.link || '#'}
                        onClick={() => {
                          subItem.link && handleFullClose()
                        }}
                      >
                        <Typography
                          fontSize={'.95rem'}
                          fontWeight={''}
                          letterSpacing={'.9px'}
                          sx={{
                            '&:hover': { color: 'info.light' },
                            fontFamily: `'Titillium Web', sans-serif`,
                            color:
                              location.pathname === subItem.link ||
                              location.pathname === `/${subItem.link}`
                                ? 'info.light'
                                : 'semiWhite.main',
                          }}
                        >
                          {subItem.title}
                        </Typography>
                      </Link>
                    )
                  })}
              </Box>
              {subMenus.item.childs && (
                <>
                  {subMenus.item.childs.length < 1 && (
                    <Typography
                      align='center'
                      fontSize={'.9rem'}
                      color={'secondary.light'}
                      component={'p'}
                      width={'100%'}
                    >
                      {eventLoad ? 'Loading...' : 'No running event available'}
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          )}
        </Box>
      </Slide>
    </Modal>
  )
}

export default MobileNav
