import LiveHelpIcon from '@mui/icons-material/LiveHelp'
import { Container, IconButton, Stack, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useFetch } from '../../custom_hooks/useFetch'
import reqs from '../../data/requests'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'

const FAQ = () => {
  const [faqs, setFaqs] = useState([])
  const [alertMsg, setAlertMsg] = useState('')
  const data = useFetch(reqs.ALL_FAQS, setAlertMsg)

  useEffect(() => {
    data && setFaqs(data)
  }, [data])

  return (
    <Container maxWidth='md' sx={{ paddingTop: '100px' }}>
      <Stack rowGap={2} alignItems={'center'} mb={5}>
        <Typography
          sx={{ fontSize: { xs: '3rem', md: '3.5' }, lineHeight: '4rem' }}
          align='center'
          color={'secondary.main'}
          textTransform={'uppercase'}
        >
          Frequently asked questions
        </Typography>
        <LiveHelpIcon
          sx={{
            fontSize: { xs: '3.5rem', md: '4rem' },
            color: 'darkBlue.main',
          }}
        />
      </Stack>

      <Stack rowGap={3}>
        {faqs.map((item, key) => {
          return <FaqItem key={key} item={item} />
        })}
      </Stack>
    </Container>
  )
}

const FaqItem = ({ item }) => {
  const [clicked, setclicked] = useState(false)
  const [height, setheight] = useState(0)
  const ansRef = useRef(null)

  useEffect(() => {
    if (clicked === true) {
      const height = ansRef.current.getBoundingClientRect().height
      setheight(height)
    }
  }, [clicked])
  return (
    <Stack
      width={'100%'}
      sx={{
        transition: '.5s ease all',
        boxShadow: clicked ? 'none' : `1px 1px 5px 1px rgba(0,0,0,.2)`,

        '&:hover': {
          boxShadow: clicked ? 'none' : `1.2px 1.2px 5px 1px rgba(0,0,0,.3)`,
        },
        cursor: 'pointer',
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        sx={{ padding: '5px 20px' }}
        onClick={() => setclicked((clicked) => !clicked)}
      >
        <Typography
          sx={{
            fontWeight: '500',
            fontSize: '1.2rem',
            color: 'secondary.main',
          }}
        >
          {item.question}
        </Typography>
        <IconButton
          sx={{
            transition: '.5s ease all',
            transform: clicked ? `rotate(180deg)` : 'none',
          }}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Stack>
      <Stack
        sx={{
          transition: '.5s ease all',
          width: '100%',
          height: clicked ? height : 0,
          overflow: 'hidden',
        }}
      >
        <Typography
          fontSize={'.95rem'}
          color='secondary.light'
          sx={{ padding: '5px 20px', cursor: 'auto' }}
          ref={ansRef}
          component={'div'}
        >
          <ReactMarkdown>{item.answer}</ReactMarkdown>
        </Typography>
      </Stack>
    </Stack>
  )
}

export default FAQ
