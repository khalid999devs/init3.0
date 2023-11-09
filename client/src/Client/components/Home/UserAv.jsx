import { Avatar, Box, Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { reqImgWrapper } from '../../../data/requests'
import { ClientContextConsumer } from '../../pages/Client'

const UserAv = () => {
  const location = useLocation()
  const {
    clientProfile: { id, userName, image },
  } = ClientContextConsumer()

  return (
    <Link
      to={id ? `/profile/${userName}` : 'login'}
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          display: 'grid',
          height: 'fit-content',
          padding: '3px 10px',
          gridTemplateColumns: 'auto auto',
          border: (theme) => ({
            xs: 'none',
            md: `1px solid ${
              theme.palette[
                location.pathname === `/profile/${userName}`
                  ? 'info'
                  : 'darkBlue'
              ].main
            }`,
          }),
          opacity: '1',
          cursor: 'pointer',
          userSelect: 'none',
          transition: '.3s ease all',
          '&:hover': {
            border: (theme) => ({
              xs: 'none',
              md: `1px solid ${theme.palette.info.main}`,
            }),
          },
          '&:hover p': {
            color: 'info.main',
          },
          columnGap: id ? '5px' : '0',
        }}
      >
        <Avatar
          alt='Remy Sharp'
          src={reqImgWrapper(image) || '/Images/person.webp'}
          loading='lazy'
          sx={{
            width: { xs: '25px', md: '17px' },
            height: { xs: '25px', md: '17px' },
            margin: 'auto',
            backgroundColor: 'rgba(0,0,0,.4)',
            transition: '.3s ease all',
            outline: (theme) => ({
              xs: `2px solid ${
                location.pathname === `/profile/${userName}`
                  ? theme.palette.info.main
                  : 'none'
              }`,
              md: 'none',
            }),

            display: {
              xs: 'inline',
              md: id ? 'inline' : 'none',
            },
          }}
        />
        {
          <Typography
            fontSize={'.9rem'}
            textTransform={'uppercase'}
            color={
              location.pathname === `/profile/${userName}`
                ? 'info.main'
                : 'semiWhite.main'
            }
            sx={{
              transition: '.3s ease color',
              display: {
                xs: 'none',
                md: 'inline-block',
              },
            }}
          >
            {id ? 'profile' : 'log in'}
          </Typography>
        }
      </Box>
    </Link>
  )
}

export default UserAv
