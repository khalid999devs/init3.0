import styled from '@emotion/styled'
import { EmailOutlined, Phone } from '@mui/icons-material'
import {
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminFetch } from '../../custom_hooks/useAdminFetch'
import reqs from '../../data/requests'
import { InputTextField } from '../../global_components/FormControls'
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
  const [ans, setAns] = useState([])

  useEffect(() => {
    setMessages(() => {
      return [
        ...(data.result
          ? data.result.map((result) => {
              ans.push({ id: result.id, value: '' })
              return result
            })
          : []),
      ]
    })
  }, [data])

  return (
    <Container
      maxWidth='xl'
      sx={{
        padding: {
          xs: '0 10px 0 50px',
          xl: 0,
        },
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          marginBottom: '150px',
          minWidth: (theme) => theme.breakpoints.values.lg,
          width: (theme) => theme.breakpoints.values.xl,
        }}
      >
        <Table size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <StyledCell>SL</StyledCell>
              <StyledCell>Name</StyledCell>
              <StyledCell>Institute</StyledCell>
              <StyledCell>Email</StyledCell>
              <StyledCell>Phone</StyledCell>
              <StyledCell>Message</StyledCell>
              <StyledCell>Answer</StyledCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => {
              return (
                <TableRow
                  key={message.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <StyledCell component='th' scope='row'>
                    {message.id}
                  </StyledCell>
                  <StyledCell>{message.name}</StyledCell>
                  <StyledCell>{message.institute}</StyledCell>
                  <StyledCell>
                    <Typography>{message.email}</Typography>
                    <Stack>
                      <Link
                        to={`/admin/messages?phone=${message.phone}&name=${message.name}&email=${message.email}`}
                        style={{ color: 'brown' }}
                      >
                        <EmailOutlined />
                      </Link>
                    </Stack>
                  </StyledCell>
                  <StyledCell>
                    {message.phone} <br />{' '}
                    <Link
                      to={`/admin/messages?phone=${message.phone}&name=${message.name}&email=${message.email}`}
                    >
                      <Phone color='success' />
                    </Link>
                  </StyledCell>

                  <StyledCell
                    style={{ maxWidth: message.replied ? '' : '100px' }}
                  >
                    {message.message}
                  </StyledCell>
                  <StyledCell
                    style={{ minWidth: message.replied ? '60px' : '300px' }}
                  >
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
