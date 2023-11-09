import { Box, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import reqs from '../../../data/requests'
import { UnderlinedTypo } from '../../../global_components/Typographies'

const Notices = () => {
  const [notices, setNotices] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    axios
      .get(reqs.ALL_NOTICES)
      .then((res) => {
        if (res.data.succeed) {
          setNotices(res.data.result.slice(0, 3))
        }
      })
      .catch((err) => {
        setErr(err.response.data.msg)
      })
  }, [])

  return (
    <Box p={1}>
      <UnderlinedTypo
        text='Notices'
        color='darkBlue.main'
        variant='h6'
        underlined={true}
      />
      <Box p={1} pb={2}>
        {err
          ? err
          : notices.map((notice, value) => {
              return (
                <Typography
                  align='left'
                  sx={{}}
                  mb={2}
                  component={'p'}
                  key={notice.id}
                >
                  <Typography
                    component={'span'}
                    color={'primary'}
                    sx={{ fontWeight: 'bolder' }}
                  >
                    {value + 1}
                  </Typography>
                  . {notice.message}
                </Typography>
              )
            })}
      </Box>

      <Stack
        justifyContent={'space-between'}
        flexDirection={'row'}
        alignItems='center'
      >
        <Typography fontWeight={700} component={'span'}>
          Total -{' '}
          <Typography component='span' fontWeight={700} color='darkBlue.main'>
            {notices.length}
          </Typography>
        </Typography>
        <Link
          style={{
            color: '#2590ce',
            fontWeight: '400',
            textDecoration: 'none',
          }}
          to='setting'
        >
          See All {'->'}
        </Link>
      </Stack>
    </Box>
  )
}

export default Notices
