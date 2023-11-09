import { Box, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'
import { useFetch } from '../../../custom_hooks/useFetch'
import reqs from '../../../data/requests'
import { RouterStyledLink } from '../../../customStyles/StyledLinks'
import ReactMarkdown from 'react-markdown'

const Notices = ({ full }) => {
  const [notices, setNotices] = useState([])
  const [alertMsg, setAlertMsg] = useState('')
  const data = useFetch(reqs.ALL_NOTICES, setAlertMsg)

  useEffect(() => {
    data && setNotices(data?.reverse())
  }, [data])

  return (
    <>
      {notices.length > 0 && (
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            zIndex: '3',
            padding: '50% 0 0 5%',
            borderRight: '1px solid rgba(255,255,255,.15)',
          }}
        >
          <Box
            sx={{
              minHeight: '400px',
              height: 'max-content',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              width: '100%',
              margin: '20px auto',
              rowGap: '10px',
              position: 'relative',

              '&::after': !full && {
                content: `''`,
                position: 'absolute',
                height: '70%',
                width: '30%',
                zIndex: '-1',
                backgroundColor: 'tranparent',
                border: (theme) => `2px solid ${theme.palette.info.main}`,
                borderTopLeftRadius: '5px',
                borderBottomLeftRadius: '5px',
                borderRightWidth: 0,
                opacity: '.5',
                bottom: '0%',
                right: '0',
              },
            }}
            flexDirection='column'
          >
            {notices.slice(0, full ? notices.length : 1).map((notice, key) => {
              return (
                <Box
                  key={key}
                  color={'semiWhite.main'}
                  sx={{
                    WebkitBackdropFilter: 'blur(8px)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '5px',
                    width: '70%',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'semiWhite.main',
                      opacity: 0.8,
                      p: 1,
                      m: 1,
                      fontSize: '.9rem',
                      fontFamily: `'Titillium Web', sans-serif`,
                      letterSpacing: '.9px',
                      fontWeight: '600',
                    }}
                    component={'div'}
                  >
                    <ReactMarkdown>{notice.message}</ReactMarkdown>
                  </Typography>
                </Box>
              )
            })}
          </Box>
          <Stack
            width={'100%'}
            justifyContent='flex-end'
            alignItems={'flex-end'}
            sx={{ position: 'relative' }}
          >
            <Box
              sx={{
                width: '100px',
              }}
              className='chat-bot'
            >
              <img
                width={'100%'}
                src='Images/cBot.png'
                alt=''
                className='chat-bot-img'
                loading='lazy'
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                p: 0.8,
                WebkitBackdropFilter: 'blur(5px)',
                backdropFilter: 'blur(5px)',
                top: '-10%',
                right: {
                  md: '22%',
                  lg: '20%',
                  xl: '-30%',
                },
                border: `1px solid rgba(255,255,255,.2)`,
                opacity: '.9',
                borderRadius: '20px 0 20px 0',
              }}
            >
              <RouterStyledLink
                style={{
                  cursor: 'pointer',
                  opacity: '.8',
                  letterSpacing: '1px',
                  fontFamily: `'Titillium Web', sans-serif`,
                }}
                to='/notices'
              >
                wanna see more?
              </RouterStyledLink>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  )
}

export default Notices
