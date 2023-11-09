import styled from '@emotion/styled'
import { Box, Container, Link as LinkR, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useFetch } from '../../custom_hooks/useFetch'
import reqs, { reqImgWrapper } from '../../data/requests'
import { navigationLinks } from '../../data/client'
import { Link } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ContactMailSharpIcon from '@mui/icons-material/ContactMailSharp'
import { ListedContact } from '../../global_components/Structures'
import { GlobalContextConsumer } from '../../GlobalContext'
import CallSharpIcon from '@mui/icons-material/CallSharp'
import EmailSharpIcon from '@mui/icons-material/EmailSharp'
import { socialIcons } from '../../data/client'
import { RouterStyledLink, StyledLink } from '../../customStyles/StyledLinks'

const SponsorBox = styled(Box)({
  maxWidth: '200px',
  width: '100%',
})

const StyledRouteLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.semiWhite.light,
  fontSize: '1rem',
  transition: '.3s linear color',
  '&:hover': {
    color: theme.palette.info.main,
    textDecoration: 'underLine',
  },
  fontFamily: `'Roboto', sans-serif`,
  letterSpacing: '1px',
  marginBottom: '4px',
  width: 'max-content',
  marginLeft: '10px',
  opacity: '.9',
}))

const StyledSocialLinks = styled(LinkR)(({ theme }) => ({
  color: theme.palette.semiWhite.main,
  margin: '0 5px',
  transition: `.3s all ${theme.transitions.easing.cubic1}`,
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}))

const Footer = () => {
  const [sponsors, setSponsors] = useState([])
  const [alertMsg, setAlertMsg] = useState('')
  const data = useFetch(reqs.GET_ALL_SPONSOR, setAlertMsg)
  const {
    appSetting: { gmails, phones },
  } = GlobalContextConsumer()

  const isFooterNavs = navigationLinks
    .filter((item) => {
      if (item.footer === true) return item
    })
    .slice(0, 5)

  const footernavigations = isFooterNavs.map((item) => {
    let afterItem = item
    if (item.sub === true)
      [afterItem] = item.childs.filter((subitem) => subitem.footer === true)

    return afterItem
  })

  useEffect(() => {
    data && setSponsors(data)
  }, [data])
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '60vh',
        paddingTop: '100px',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      {/* help bar */}
      <Typography
        textAlign={'center'}
        fontWeight={'bold'}
        fontSize={'1.1rem'}
        color={'warning.main'}
        mb={5}
      >
        Facing any problems? Go to{' '}
        <StyledLink
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          target='_blank'
          href='./faq'
        >
          FAQ
        </StyledLink>
      </Typography>
      {/* sponsors */}
      <Stack
        alignItems={'center'}
        justifyContent='center'
        gap={3}
        flexWrap='wrap'
        flexDirection={'row'}
        mb={'50px'}
        height='min-content'
      >
        {sponsors.map((sponsor, key) => {
          return (
            <SponsorBox key={key}>
              <LinkR href={sponsor.link} target='_blank'>
                <LazyLoadImage
                  style={{ objectFit: 'cover' }}
                  width='100%'
                  height={'100%'}
                  src={reqImgWrapper(sponsor.image)}
                  alt={sponsor.name}
                  effect='blur'
                />
              </LinkR>
            </SponsorBox>
          )
        })}
      </Stack>
      {/* footer */}
      <Box
        width={'100%'}
        height={'100%'}
        bgcolor={'primary.main'}
        sx={{ display: 'grid', rowGap: '30px' }}
        color={'semiWhite.light'}
      >
        <Box
          sx={{
            maxWidth: (theme) => theme.breakpoints.values.lg,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr 1fr 1fr',
            },
            columnGap: '20px',
            rowGap: '10px',
            margin: '0 auto',
            padding: '5px 10px',
            paddingLeft: { xs: 2, md: '10px' },
          }}
        >
          <Stack>
            <Box sx={{ maxWidth: '300px', width: '100%', maxHeight: '200px' }}>
              <LazyLoadImage
                style={{ objectFit: 'cover', opacity: '.8' }}
                width='100%'
                height={'100%'}
                src='/Images/nditc.png'
                alt={'logo'}
                effect='blur'
              />
            </Box>
            <Typography
              fontFamily={`'Titillium Web', sans-serif`}
              textTransform={'uppercase'}
              sx={{ transform: 'translateY(-30px)', ml: { xs: 1, md: 0 } }}
            >
              Innovate and Encode Your Ideas
            </Typography>
          </Stack>
          <Stack
            sx={{
              pt: { xs: 0, md: 5 },
              pl: { xs: 0, md: 4 },
              alignItems: { md: 'flex-end' },
            }}
          >
            <Stack>
              <Typography
                variant='h6'
                mb={0.8}
                sx={{ opacity: '.7', color: 'info.main' }}
                textTransform={'capitalize'}
              >
                Quick links
              </Typography>
              <Stack textAlign={'left'}>
                {footernavigations.map((item, key) => {
                  return (
                    <StyledRouteLink
                      style={{ fontFamily: `'Titillium Web', sans-serif` }}
                      key={key}
                      to={item.link}
                    >
                      {item.title}
                    </StyledRouteLink>
                  )
                })}
                <StyledRouteLink
                  style={{ fontFamily: `'Titillium Web', sans-serif` }}
                  to={'developers'}
                >
                  Developers
                </StyledRouteLink>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            alignItems={'flex-end'}
            sx={{
              pt: { xs: 4, md: 5 },
              pl: { xs: 0, md: 4 },
              alignItems: { md: 'flex-end' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',

                justifyContent: { md: 'center' },
                width: '100%',
                transform: { lg: 'translateX(8%)' },
                opacity: '.7',
                color: 'info.main',
                ml: { xs: -0.7, md: 0 },
              }}
              mb={1}
            >
              <LocationOnIcon />
              <Typography
                component={'span'}
                variant='h6'
                textTransform={'capitalize'}
              >
                Find Us
              </Typography>
            </Box>
            <Typography
              sx={{
                marginLeft: '10px',
                opacity: '.9',
                fontFamily: `'Titillium Web', sans-serif`,
              }}
            >
              Notre Dame College,
              <br /> Motijheel, Dhaka
            </Typography>
          </Stack>
          <Stack
            alignItems={'flex-end'}
            sx={{
              pt: { xs: 4, md: 5 },
              pl: { xs: 0, md: 4 },
              alignItems: { md: 'flex-end' },
            }}
          >
            <Stack>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: '5px',
                  opacity: '.7',
                  color: 'info.main',
                  width: '100%',
                }}
                mb={1.5}
              >
                <ContactMailSharpIcon />
                <Typography
                  component={'span'}
                  variant='h6'
                  textTransform={'capitalize'}
                >
                  Contact Us
                </Typography>
              </Box>
              <Stack rowGap={1}>
                <ListedContact
                  items={gmails}
                  icon={
                    <EmailSharpIcon
                      sx={{ marginRight: 1, fontSize: '1.3rem' }}
                    />
                  }
                  spacing={'.5px'}
                />
                <ListedContact
                  items={phones}
                  icon={
                    <CallSharpIcon
                      sx={{ marginRight: 1, fontSize: '1.3rem' }}
                    />
                  }
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>
        {/* social icons */}
        <Stack
          sx={{ width: 'max-content', margin: '0px auto' }}
          flexDirection={'row'}
          columnGap={2}
        >
          {socialIcons.map((item, key) => {
            return (
              <StyledSocialLinks key={key} href={item.link} target='_blank'>
                {item.icon}
              </StyledSocialLinks>
            )
          })}
        </Stack>

        <Typography
          pb={2}
          align='center'
          fontSize={'14px'}
          color={'semiWhite.light'}
          sx={{ opacity: '.8' }}
        >
          &copy; {new Date().getFullYear()}{' '}
          <LinkR
            sx={{
              opacity: '.8',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              color: 'info.main',
            }}
            href='https://nditc.org/'
            target='_blank'
          >
            NDITC
          </LinkR>{' '}
          all rights reserved | Developed by{' '}
          <RouterStyledLink to={'/developers'} style={{ opacity: '.8' }}>
            NDITC Web Development Team
          </RouterStyledLink>
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer
