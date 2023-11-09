import { Box, Typography } from '@mui/material'
import { fontWeight } from '@mui/system'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import reqs from '../../../data/requests'
import { UnderlinedTypo } from '../../../global_components/Typographies'

const Messages = () => {
  const [err, setErr] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios
      .get(reqs.ALL_CONTACT_MESSAGES, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setMessages(res.data.result.slice(0, 3))
        }
      })
      .catch((err) => {
        setErr(err.response.data.msg)
      })
  }, [])

  return (
    <Box p={1}>
      <UnderlinedTypo
        text='Contact Messages'
        color='info.main'
        variant='h6'
        underlined={false}
      />
      {err ? (
        <div>{err}</div>
      ) : (
        messages.map((message) => {
          return (
            <Box
              key={message.id}
              p={1}
              sx={{ borderRadius: '5px', margin: '10px 0' }}
            >
              <Typography
                sx={{
                  fontSize: '1rem',
                  letterSpacing: (theme) => theme.spacing(0.2),
                  color: 'info.light',
                  opacity: '.9',
                }}
                variant='h6'
                component='p'
                align='left'
              >
                {message.name} {'>'}
              </Typography>
              <Typography
                align='left'
                sx={{
                  fontSize: '.9rem',
                  letterSpacing: (theme) => theme.spacing(0.13),
                  color: 'white',
                  opacity: 0.7,
                  fontWeight: 300,
                }}
              >
                {message.message}
              </Typography>
            </Box>
          )
        })
      )}
      <Link
        style={{
          color: '#2590ce',
          fontWeight: '400',
          textDecoration: 'none',
        }}
        to='contacts'
      >
        See All {'->'}
      </Link>
    </Box>
  )
}

export default Messages
