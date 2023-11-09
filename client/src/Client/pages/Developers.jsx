import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import PageLabel from '../components/PageLabel'
import { socialLinksMap } from '../../data/client'

const Developers = () => {
  const [info, setInfo] = useState([
    {
      name: '',
      image: '/Images/setters/placeholder.jpg',
      role: '',
      clgRoll: '',
      socialLinks: [],
    },
  ])

  const getData = async () => {
    try {
      const data = await fetch('json/developer.json')
      const objData = await data.json()
      if (objData) setInfo(objData)
    } catch (error) {
      // console.log(error)
    }
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      return <PageLabel label={'Developers'} />
      <Container maxWidth='lg' sx={{ paddingTop: '100px', width: '100%' }}>
        <Stack
          columnGap={8}
          rowGap={6}
          alignItems='center'
          justifyContent={'center'}
          flexWrap='wrap'
          flexDirection={'row'}
        >
          {info.map((per, value) => {
            return (
              <Card
                key={value}
                sx={{
                  maxWidth: 320,
                  transition: '.5s ease all',
                  '&:hover': {
                    boxShadow: '0 0 10px 3px rgba(0,0,0,.2)',
                  },
                }}
                elevation={0}
              >
                <CardMedia
                  component='img'
                  height='300'
                  sx={{ minWidth: '200px', objectFit: 'cover' }}
                  image={per.image}
                  alt='green iguana'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {per.name}
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    {per.clgRoll}
                  </Typography>
                  {per.position && (
                    <Typography variant='body2' color='text.secondary'>
                      {per.position}
                    </Typography>
                  )}

                  <Typography mt={1} variant='body2' color='text.secondary'>
                    <b>role: </b>
                    {per.role}
                  </Typography>
                </CardContent>
                <CardActions>
                  {per.socialLinks.map((socialLink, value) => {
                    return (
                      <Link
                        target={'_blank'}
                        key={value}
                        href={socialLink.link}
                      >
                        <IconButton>
                          {socialLinksMap[socialLink.icon]}
                        </IconButton>
                      </Link>
                    )
                  })}
                </CardActions>
              </Card>
            )
          })}
        </Stack>
      </Container>
    </>
  )
}

export default Developers
