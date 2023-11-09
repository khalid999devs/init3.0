import { Container, Paper, Stack, Typography } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star'
import { useFetch } from '../../custom_hooks/useFetch'
import reqs from '../../data/requests'
import ReactMarkdown from 'react-markdown'

const Notices = () => {
  const [notices, setNotices] = useState([])
  const [alertMsg, setAlertMsg] = useState('')
  const data = useFetch(reqs.ALL_NOTICES, setAlertMsg)

  useEffect(() => {
    data && setNotices(data?.reverse())
  }, [data])

  return (
    <Container sx={{ paddingTop: '100px' }} maxWidth='md'>
      <Stack rowGap={0.5} alignItems={'center'} mb={6}>
        <Typography
          sx={{ fontSize: { xs: '3rem', md: '3.5' }, lineHeight: '4rem' }}
          align='center'
          color={'secondary.main'}
          textTransform={'uppercase'}
          fontWeight={'500'}
        >
          Notices
        </Typography>
        <NotificationsNoneIcon
          sx={{
            fontSize: { xs: '3.5rem', md: '4rem' },
            color: 'darkBlue.main',
          }}
        />
      </Stack>
      <Stack
        sx={{
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          rowGap: '30px',
        }}
      >
        {notices.map((notice, key) => {
          return (
            <Paper
              key={key}
              elevation={1}
              sx={{
                backgroundColor: 'primary.main',
                color: 'semiWhite.light',
                padding: 2,
                opacity: '.9',
              }}
            >
              <Stack
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={0.5}
                flexDirection={'row'}
                pr={1}
              >
                <Typography
                  fontSize={'1.2rem'}
                  fontWeight={'500'}
                  color={'info.light'}
                >
                  {notice.type}
                </Typography>

                <StarIcon
                  sx={{
                    color: notice.warn ? 'warning.light' : 'secondary.light',
                    fontSize: '2rem',
                  }}
                />
              </Stack>
              <Typography
                color={'semiWhite.light'}
                sx={{ padding: '10px 0', opacity: '.9' }}
                fontSize={'.95rem'}
                component={'div'}
              >
                <ReactMarkdown>{notice.message}</ReactMarkdown>
              </Typography>
            </Paper>
          )
        })}
      </Stack>
    </Container>
  )
}

export default Notices
