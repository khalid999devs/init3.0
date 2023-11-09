import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { UnderlinedTypo } from '../../../global_components/Typographies'
import StarIcon from '@mui/icons-material/Star'
import axios from 'axios'
import reqs from '../../../data/requests'
import { Link } from 'react-router-dom'
import { reqImgWrapper } from '../../../data/requests'

const CAInfo = () => {
  const [cas, setCas] = useState([])
  const [err, setErr] = useState('')
  const [totalCa, setTotal] = useState(0)

  useEffect(() => {
    axios
      .post(reqs.CA_ORDEREDBY_POINT, {
        skip: 0,
        rowNum: 8,
      })
      .then((res) => {
        if (res.data.succeed) {
          setCas(res.data.result)
        }
        return axios.get(reqs.ALL_COUNT_ONEVENT + 'cas', {
          withCredentials: true,
        })
      })
      .then((res) => {
        if (res.data.succeed) {
          setTotal(res.data.result)
        }
      })
      .catch((err) => {
        setErr(err.response.data.msg)
      })
  }, [])

  return (
    <Box p={1}>
      <UnderlinedTypo
        text='CA Info'
        color='darkBlue.main'
        variant='h6'
        underlined={true}
      />
      <Box pb={3}>
        {err ? (
          <Box>{err}</Box>
        ) : (
          cas.map((ca) => {
            return (
              <Stack
                key={ca.id}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                mt={2}
              >
                <Stack
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40,
                      margin: '5px',
                    }}
                    loading={'lazy'}
                    alt={ca.fullName}
                    src={reqImgWrapper(ca.image) || ''}
                  />
                  <Typography
                    component={'span'}
                    fontWeight={700}
                    color={'darkblue.main'}
                    pl={1}
                    sx={{ fontSize: '.9rem', lineHeight: '17px' }}
                  >
                    {ca.fullName}
                    <br />
                    <Typography
                      fontWeight={300}
                      variant='p'
                      sx={{
                        fontSize: '.7rem',
                      }}
                      component={'p'}
                      align='left'
                    >
                      {ca.institute}
                    </Typography>
                  </Typography>
                </Stack>
                <Stack
                  alignItems={'center'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                >
                  <Typography fontWeight={700} component={'span'}>
                    {ca.used}
                  </Typography>
                  <IconButton aria-label='delete' disabled color='primary'>
                    <StarIcon sx={{ color: 'goldenrod' }} />
                  </IconButton>
                </Stack>
              </Stack>
            )
          })
        )}
      </Box>

      <Stack
        justifyContent={'space-between'}
        flexDirection={'row'}
        alignItems='center'
      >
        <Typography fontWeight={700} component={'span'}>
          Total -{' '}
          <Typography component='span' fontWeight={700} color='darkBlue.main'>
            {totalCa}
          </Typography>
        </Typography>
        <Link
          style={{
            color: '#2590ce',
            fontWeight: '400',
            textDecoration: 'none',
          }}
          to='cas'
        >
          See All {'->'}
        </Link>
      </Stack>
    </Box>
  )
}

export default CAInfo
