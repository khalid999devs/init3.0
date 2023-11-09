import { Box, Typography } from '@mui/material'
import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Submenu = ({
  isSubmenuOpen,
  page: { page, links },
  subMenuLocation,
  closeSubmenu,
  caRegPermit,
  eventLoad,
}) => {
  const location = useLocation()
  const container = useRef(null)
  const wrapper = useRef(null)
  const [columns, setColumns] = useState('repeat(2, auto)')

  useEffect(() => {
    setColumns('repeat(2, auto)')
    const submenu = container.current
    const { center, bottom } = subMenuLocation
    submenu.style.left = `${center}px`
    wrapper.current.style.top = `${bottom + 3}px`
    submenu.style.top = `${bottom}px`

    if (links.length === 3) {
      setColumns('repeat(3, auto)')
    }
    if (links.length > 3) {
      setColumns('repeat(4, auto)')
    }
  }, [page, subMenuLocation, links])

  return (
    <Box
      sx={{
        display: { xs: 'none', md: isSubmenuOpen === true ? 'block' : 'none' },
        position: 'fixed',
        top: '50px',
        left: '0',
        zIndex: 1000,
        backgroundColor: 'transparent',
        width: '100%',
        height: container.current
          ? container.current.clientHeight + 30
          : 'auto',
      }}
      ref={wrapper}
      className='submenu-wrapper'
      onMouseOver={(e) => {
        if (e.target.classList.contains('submenu-wrapper')) {
          closeSubmenu()
        }
      }}
    >
      <Box
        sx={{
          padding: 3.5,
          display: { xs: 'none', md: 'grid' },
          position: 'fixed',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'primary.main',
          transition: '.5s ease all',
          gridTemplateColumns: columns,
          columnGap: 3,
          rowGap: 0.7,
          boxShadow: '0px 1px 1px 0px rgba(0,0,0,.7)',
        }}
        ref={container}
      >
        {links && links.length > 0 ? (
          links.map((subItem, key) => {
            if (subItem.title === 'CA' && caRegPermit === false) return ''
            return (
              <Link
                key={key}
                style={{ width: 'fit-content', textDecoration: 'none' }}
                to={subItem.link || '#'}
                onClick={() => {
                  subItem.link && closeSubmenu()
                }}
              >
                <Typography
                  fontSize={'.9rem'}
                  letterSpacing={'.9px'}
                  sx={{
                    transition: '.5s ease all',
                    '&:hover': { color: 'info.main' },
                    fontFamily: `'Titillium Web', sans-serif`,
                    color:
                      location.pathname === subItem.link ||
                      location.pathname === `/${subItem.link}`
                        ? 'info.light'
                        : 'semiWhite.main',
                  }}
                >
                  {subItem.title || ''}
                </Typography>
              </Link>
            )
          })
        ) : (
          <Typography
            align='center'
            fontSize={'1.1rem'}
            color={'secondary.light'}
            component={'p'}
          >
            {eventLoad ? 'Loading...' : 'No running event available'}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default Submenu
