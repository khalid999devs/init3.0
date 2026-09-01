import styled from '@emotion/styled'
import { EmailOutlined, Phone } from '@mui/icons-material'
import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminFetch } from '../../custom_hooks/useAdminFetch'
import reqs from '../../data/requests'
import { TextArea } from '../components/Contact/TextArea'

const StyledCell = styled(TableCell)({
  fontSize: '13px',
})

const Contacts = () => {
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })
  const { data } = useAdminFetch(reqs.ALL_CONTACT_MESSAGES, setAlertMsg)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages(data.result ? [...data.result] : [])
  }, [data])

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Stack mb={2} spacing={0.5}>
        <Typography variant='h4' color='secondary.main' fontWeight={700}>
          Contact messages
        </Typography>
        <Typography color='text.secondary'>
          Review visitor questions and track organizer replies.
        </Typography>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          overflowX: 'auto',
          borderRadius: 2,
          boxShadow: '0 8px 28px rgba(20, 24, 38, .10)',
        }}
      >
        <Table
          stickyHeader
          size='small'
          aria-label='Contact messages table'
          sx={{ minWidth: '1080px' }}
        >
          <TableHead
            sx={{
              '& th': {
                backgroundColor: 'primary.main',
                color: 'semiWhite.main',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              },
            }}
          >
            <TableRow>
              <StyledCell>ID</StyledCell>
              <StyledCell>Name</StyledCell>
              <StyledCell>Institution</StyledCell>
              <StyledCell>Email</StyledCell>
              <StyledCell>Phone</StyledCell>
              <StyledCell>Message</StyledCell>
              <StyledCell>Reply status</StyledCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => {
              return (
                <TableRow
                  key={message.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '& td': { verticalAlign: 'top', py: 1.5 },
                  }}
                >
                  <StyledCell component='th' scope='row'>
                    {message.id}
                  </StyledCell>
                  <StyledCell>{message.name}</StyledCell>
                  <StyledCell>{message.institute}</StyledCell>
                  <StyledCell sx={{ minWidth: '200px' }}>
                    <Typography fontSize='13px'>{message.email}</Typography>
                    <Stack mt={0.5}>
                      <Link
                        to={`/admin/messages?phone=${message.phone}&name=${message.name}&email=${message.email}`}
                        style={{ color: 'brown' }}
                        aria-label={`Email ${message.name}`}
                      >
                        <EmailOutlined fontSize='small' />
                      </Link>
                    </Stack>
                  </StyledCell>
                  <StyledCell>
                    <Typography fontSize='13px'>{message.phone}</Typography>
                    <Link
                      to={`/admin/messages?phone=${message.phone}&name=${message.name}&email=${message.email}`}
                      aria-label={`Call ${message.name}`}
                    >
                      <Phone color='success' fontSize='small' />
                    </Link>
                  </StyledCell>

                  <StyledCell sx={{ minWidth: '280px', maxWidth: '360px' }}>
                    {message.message}
                  </StyledCell>
                  <StyledCell sx={{ minWidth: '300px' }}>
                    <TextArea
                      name={message.name}
                      email={message.email}
                      replied={message.replied}
                    />
                  </StyledCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Contacts
