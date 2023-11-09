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

const ProblemSetters = () => {
  const [info, setInfo] = useState([
    {
      name: '',
      image: '/Images/setters/placeholder.jpg',
      info: '',
      socialLinks: [],
    },
  ])

  const getData = async () => {
    try {
      const data = await fetch('json/problemSetters.json')
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
      return <PageLabel label={'Problem Setters'} />
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
                  image={per.image}
                  alt='green iguana'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {per.name}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {per.info}
                  </Typography>
                </CardContent>
                {per.socialLinks[0] && (
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
                )}
              </Card>
            )
          })}
        </Stack>
      </Container>
    </>
  )
}

export default ProblemSetters
