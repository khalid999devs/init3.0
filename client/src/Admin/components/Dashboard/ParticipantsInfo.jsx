import { useEffect, useState } from 'react'
import { GlobalContextConsumer } from '../../../GlobalContext'
import { Box, Grid, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import axios from 'axios'
import reqs from '../../../data/requests'

const Item = styled(Box)({
  fontSize: '1rem',
  fontWeight: 'bold',
})

const ParticipantsInfo = () => {
  const { events } = GlobalContextConsumer()
  const modifiedEvents = [
    { name: 'All', value: 'all', category: 'all' },
    ...events,
  ]

  return (
    <Grid container spacing={1}>
      {modifiedEvents.map((event, value) => {
        return (
          <Grid key={value} item md={6} xs={12} p={0.5}>
            <Link
              style={{ textDecoration: 'none' }}
              to={`/admin/participants?category=${event.value}`}
            >
              <SingleParInfo event={event} />
            </Link>
          </Grid>
        )
      })}
    </Grid>
  )
}

function SingleParInfo({ event }) {
  const [count, setCount] = useState(0)
  const [err, setErr] = useState('')
  useEffect(() => {
    axios
      .get(reqs.ALL_COUNT_ONEVENT + event.value, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setCount(res.data.result)
        }
      })
      .catch((err) => {
        setErr(err.response.data.msg)
      })
  }, [])
  return err ? (
    <Box>{err}</Box>
  ) : (
    <Stack
      direction='row'
      spacing={2}
      justifyContent='space-between'
      sx={{
        width: '100%',
        transition: '.5s all ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0px 2px 5px 0px rgba(0,0,0,.2)',
        },
      }}
      p={2}
    >
      <Item sx={{ color: 'primary.main' }}>{event.name}</Item>
      <Item sx={{ color: 'info.main' }}>-</Item>
      <Item sx={{ color: 'darkBlue.main' }}>{count}</Item>
    </Stack>
  )
}

export default ParticipantsInfo
