import styled from '@emotion/styled'
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TableBody,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from '../../custom_hooks/useForm'
import PageLabel from '../components/PageLabel'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import CallOutlinedIcon from '@mui/icons-material/CallOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import { ListedContact } from '../../global_components/Structures'
import { GlobalContextConsumer } from '../../GlobalContext'
import axios from 'axios'
import reqs from '../../data/requests'
import { useState } from 'react'
import { CustomModal } from '../../global_components/Modals'
import { useEffect } from 'react'

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  rowGap: '10px',
  padding: '0 10px',
  width: '90%',
  margin: '0 auto',
  '& label': {
    textTransform: 'uppercase',
    fontSize: '.9rem',
    fontWeight: '500',
  },
  '&:input': {
    fontSize: '10px!important',
  },
  [theme.breakpoints.down('md')]: {
    margin: 0,
    padding: 0,
  },
}))

const StyledInfoBox = styled(Box)({
  padding: '20px',
  boxShadow: `0px 0px 10px 2px rgba(0,0,0,.25)`,
  minWidth: '250px',
  minHeight: '150px',
  height: '100%',
})

const Contact = () => {
  const {
    appSetting: { phones, gmails },
  } = GlobalContextConsumer()
  const { values, setValues, handleInputChange } = useForm({
    name: '',
    phone: '',
    email: '',
    institute: '',
    message: '',
  })
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (msg.text) setOpen(true)
    else setOpen(false)
  }, [msg])

  const handleContactSubmit = (e) => {
    e.preventDefault()

    axios
      .post(reqs.SEND_CONTACT_MESSAGE_CLIENT, values)
      .then((res) => {
        setMsg({ type: 'success', text: res.data.msg })
        setValues({
          name: '',
          phone: '',
          email: '',
          institute: '',
          message: '',
        })
      })
      .catch((err) => {
        setMsg({ type: 'error', text: err.response.data.msg })
      })
  }
  return (
    <>
      <PageLabel label={'Contact us'} fontSize={{ xs: '3rem', md: '4rem' }} />
      <Container maxWidth='lg' sx={{ paddingTop: '100px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'auto',
              md: 'auto auto',
            },
            padding: '0 20px',
            margin: '20px auto',
            rowGap: '30px',
            maxWidth: (theme) => theme.breakpoints.values.md,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              '&::after': {
                position: 'absolute',
                top: 0,
                right: '5%',
                backgroundColor: 'primary.light',
                width: '1px',
                height: '100%',
                content: `''`,
                opacity: '.5',
                display: {
                  xs: 'none',
                  md: 'inline-block',
                },
              },
            }}
          >
            <Typography
              variant='h3'
              color='primary.main'
              textTransform={'uppercase'}
              sx={{
                maxWidth: { xs: '400px', md: '200px' },
                lineHeight: {
                  xs: '3.5rem',
                  md: '4.5rem',
                },
                wordSpacing: '5px',
                fontSize: '700',
              }}
            >
              Feel free to message us
            </Typography>
          </Box>

          <StyledForm onSubmit={handleContactSubmit}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'auto',
                  sm: 'auto auto',
                },

                columnGap: {
                  xs: '35px',
                  md: '20px',
                },
                rowGap: {
                  xs: '25px',
                  sm: '20px',
                },
              }}
            >
              <TextField
                label='name'
                variant='standard'
                color={'darkBlue'}
                name={'name'}
                value={values.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label='phone'
                variant='standard'
                color={'darkBlue'}
                name={'phone'}
                value={values.phone}
                onChange={handleInputChange}
              />
              <TextField
                label='email'
                color={'darkBlue'}
                variant='standard'
                name={'email'}
                value={values.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                label='institute'
                variant='standard'
                name={'institute'}
                color={'darkBlue'}
                value={values.institute}
                onChange={handleInputChange}
                required
              />
            </Box>
            <TextField
              label='message'
              multiline
              rows={5}
              sx={{ mt: 2 }}
              color={'darkBlue'}
              variant='standard'
              name={'message'}
              value={values.message}
              onChange={handleInputChange}
              required
            />

            <Stack mt={4}>
              <Button
                variant='outlined'
                color='darkBlue'
                type='submit'
                sx={{ maxWidth: 'max-content', borderRadius: 0 }}
              >
                Submit
              </Button>
            </Stack>
          </StyledForm>
        </Box>
        <Stack
          justifyContent={'center'}
          columnGap={'30px'}
          flexDirection={'row'}
          rowGap={'30px'}
          alignItems={'center'}
          sx={{ margin: '100px auto', minHeight: '150px' }}
          flexWrap={'wrap'}
        >
          <StyledInfoBox>
            <ListedContact
              items={phones}
              icon={<CallOutlinedIcon sx={{ fontSize: '2rem' }} />}
              spacing={'.4px'}
              direction={'column'}
              rowGap={'10px'}
              fontSize={'1rem'}
              lineHeight={'1.8rem'}
            />
          </StyledInfoBox>
          <StyledInfoBox>
            <ListedContact
              items={gmails}
              icon={<MailOutlineIcon sx={{ fontSize: '2rem' }} />}
              spacing={'.4px'}
              direction={'column'}
              rowGap={'10px'}
              fontSize={'1rem'}
              lineHeight={'1.8rem'}
            />
          </StyledInfoBox>
          <StyledInfoBox style={{ borderRight: 'none' }}>
            <ListedContact
              icon={<LanguageOutlinedIcon sx={{ fontSize: '2rem' }} />}
              direction={'column'}
              rowGap={'10px'}
            >
              <Link
                sx={{
                  fontSize: '1.05rem',
                  letterSpacing: '.4px',
                  fontFamily: `'Roboto', sans-serif`,
                  opacity: '.8',
                  textDecoration: 'none',
                  color: 'darkBlue.main',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                href='https://nditc.org'
                target='_blank'
              >
                https://nditc.org
              </Link>
            </ListedContact>
          </StyledInfoBox>
        </Stack>
        <Box width={'100%'} sx={{ minHeight: '300px' }}>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1826.2488400123784!2d90.42088988358705!3d23.729625834334342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9141003f977%3A0x511a0d62ccbc8feb!2sNotre%20Dame%20Information%20Technology%20Club!5e0!3m2!1sen!2sbd!4v1657529158126!5m2!1sen!2sbd'
            width='100%'
            height='700'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </Box>
      </Container>
      {/* modal */}
      <CustomModal
        open={open}
        hideClose={true}
        color={msg.type === 'error' ? 'warning.main' : 'secondary.main'}
        setOpen={setOpen}
      >
        <Typography
          sx={{
            fontSize: '1.1rem',
            padding: '10px',
            color: msg.type === 'error' ? 'primary.main' : 'semiWhite.main',
          }}
        >
          {msg.text}
        </Typography>
        <Stack mt={3} alignItems={'flex-end'}>
          <Button
            variant='text'
            color={msg.type === 'error' ? 'semiWhite' : 'info'}
            onClick={() => {
              setMsg({ type: '', text: '' })
            }}
            sx={{ width: 'max-content', borderRadius: 0 }}
          >
            ok
          </Button>
        </Stack>
      </CustomModal>
    </>
  )
}

export default Contact
