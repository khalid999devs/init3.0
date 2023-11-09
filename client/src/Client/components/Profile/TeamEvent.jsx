import { Box, Link, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useState, useEffect } from 'react'
import reqs from '../../../data/requests'
import GroupsIcon from '@mui/icons-material/Groups'
import styled from '@emotion/styled'
import { objToArray } from '../../../Utils/objToArray'

const StyledList = styled('ul')(({ theme }) => ({
  width: '100%',

  '& li': {
    marginBottom: '5px',
    position: 'relative',
    marginLeft: '15px',
    paddingLeft: '5px',
  },
  '& li::marker': {
    content: `"➔"`,
    color: theme.palette.info.main,
    fontWeight: 'bolder',
  },
}))

const TeamEvent = ({ team, userName, fullName }) => {
  const [eventInfo, setEventInfo] = useState({})

  useEffect(() => {
    if (!eventInfo.name) {
      axios
        .get(`${reqs.FIND_TEAM_INFO}${team.value}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.succeed) {
            const teamInfo = res.data.result
            setEventInfo({ ...teamInfo, members: JSON.parse(teamInfo.members) })
          }
        })
    }
  }, [eventInfo])

  const { name, leader, event, members } = eventInfo
  let membersNames = objToArray(members)
  membersNames.unshift({ name: leader, value: 1 })

  return (
    <Box
      sx={{
        maxWidth: '350px',
        width: '100%',
        minHeight: '80px',
        transition: '.5s ease all',
        boxShadow: '1px 1px 5px 1px rgba(0,0,0,.3)',
        padding: '10px 15px',
      }}
    >
      <Stack
        flexDirection={'row'}
        columnGap={2}
        alignItems={'center'}
        height={'max-content'}
      >
        <GroupsIcon sx={{ fontSize: '1.8rem', color: 'secondary.main' }} />
        <Typography
          fontSize={'1.1rem'}
          fontWeight={'bold'}
          color={'secondary.light'}
          width={'100%'}
        >
          {name}
          <Typography
            component={'span'}
            sx={{ opacity: 0.8, fontSize: '.9rem' }}
          >
            &nbsp;&nbsp;{`( ${team.name} )`}
          </Typography>
        </Typography>
      </Stack>
      <Stack p={2}>
        <StyledList>
          {membersNames.map((member, key) => {
            return (
              <li key={key}>
                <Link
                  sx={{
                    textDecoration: 'none',
                    fontFamily: `'Roboto', sans-serif`,
                    fontSize: '.9rem',
                    color:
                      member.name === userName
                        ? 'success.main'
                        : 'primary.main',
                    fontWeight: member.name === userName ? '500' : 'initial',
                    transition: '.3s ease all',
                    '&:hover': {
                      color:
                        member.name === userName
                          ? 'success.main'
                          : 'darkBlue.main',
                    },
                  }}
                  target='_blank'
                  href={
                    member.name === userName
                      ? null
                      : `/profile/view/${member.name}`
                  }
                >
                  {member.name === userName ? fullName : member.name}
                  {member.name === leader && (
                    <Typography
                      component={'span'}
                      fontSize={'.8rem'}
                      sx={{ opacity: 0.8 }}
                      color={'error.main'}
                    >
                      &nbsp;&nbsp;- leader
                    </Typography>
                  )}
                </Link>
              </li>
            )
          })}
        </StyledList>
      </Stack>
    </Box>
  )
}

export default TeamEvent
