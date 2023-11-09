import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate'
import Delete from '@mui/icons-material/Delete'
import EditOutlined from '@mui/icons-material/EditOutlined'
import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { reqImgWrapper } from '../../../data/requests'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { InfoTypography } from '../../../global_components/Typographies'
import { StyledLink } from '../../../customStyles/StyledLinks'
import ReactMarkdown from 'react-markdown'

const EventItem = ({
  eventObj,
  setValues,
  values,
  setFormMode,
  deleteEvent,
  changeRegPortal,
  changeFieldPermit,
}) => {
  const [seeMoreDesc, setSeeMoreDesc] = useState(false)
  let {
    id,
    name,
    category,
    timeRange,
    videoLink,
    description,
    image,
    value,
    type,
    paid,
    fee,
    team,
    maxMember,
    place,
    submission,
    rules,
    regPortal,
    date,
    roll,
  } = eventObj
  let ruleLength = rules.split('~~').length
  let d = new Date(date)
  date = `${d.getFullYear()}/${
    d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
  }/${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`

  if (typeof submission !== 'object' && JSON.parse(submission))
    submission = JSON.parse(submission)

  return (
    <Grid
      sx={{
        borderRadius: '10px',
        boxShadow: '0 0 10px 2px rgba(0,0,0,.2)',
        transition: '.5s ease all',
      }}
      m={2}
      container
    >
      <Grid item xs={12} md={2.5}>
        <LazyLoadImage
          effect='blur'
          width={'100%'}
          height={'100%'}
          style={{ objectFit: 'cover' }}
          src={reqImgWrapper(image)}
          alt={name}
        />
      </Grid>
      <Grid item xs={12} md={4.5}>
        <Box>
          <Stack
            pl={1}
            alignItems='center'
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography
              variant='subtitle1'
              color={'secondary.light'}
              fontWeight={'600'}
              component={'span'}
            >
              {name}
            </Typography>
            <span>
              <IconButton
                onClick={() => {
                  setValues((values) => {
                    return {
                      ...values,
                      ...eventObj,
                      date: date,
                      event: {},
                      submission:
                        type === 'online'
                          ? submission
                          : {
                              type: 'link',
                              name: '',
                              size: '',
                            },
                    }
                  })
                  setFormMode('edit')
                }}
                aria-label='edit'
                color='primary'
              >
                <EditOutlined sx={{ fontSize: '1.2rem' }} color={'darkBlue'} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setValues((values) => {
                    return {
                      ...values,
                      name: name,
                      event: {},

                      id: id,
                    }
                  })
                  setFormMode('imgEdit')
                }}
                aria-label='edit'
              >
                <AddPhotoAlternate
                  sx={{ fontSize: '1.2rem' }}
                  color={'success'}
                />
              </IconButton>
              <IconButton
                onClick={() => deleteEvent(id)}
                aria-label='edit'
                color='primary'
              >
                <Delete sx={{ fontSize: '1.2rem' }} color={'error'} />
              </IconButton>
            </span>
          </Stack>
          <Box
            p={1}
            pl={2}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: '5px',
              fontSize: '.9rem',
            }}
          >
            <InfoTypography label={'value'} info={value} />
            <InfoTypography label={'type'} info={type} />
            <InfoTypography label={'category'} info={category} />
            <InfoTypography label={'time range'} info={timeRange} />
            <InfoTypography label={'date'} info={date} />
            <InfoTypography label={'place'} info={place || 'N/A'} />
            <InfoTypography label={'max-member'} info={maxMember || 'N/A'} />
            {paid && (
              <InfoTypography
                color={'warning.dark'}
                label={'paid'}
                info={'true'}
              />
            )}

            <InfoTypography label={'fee'} info={fee || 'N/A'} />
            {team && (
              <InfoTypography
                color={'warning.dark'}
                label={'team'}
                info={'true'}
              />
            )}
            {submission && (
              <InfoTypography
                color={'warning.dark'}
                label={'submission'}
                info={'true'}
              />
            )}

            <span>
              <strong>
                <i>link : </i>
              </strong>
              <StyledLink
                style={{ wordBreak: 'break-all' }}
                target={'_blank'}
                href={videoLink}
              >
                {videoLink.slice(0, 25)}...
              </StyledLink>
            </span>
            <FormControlLabel
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '.8rem',
                  fontWeight: 'bolder',
                  fontStyle: 'italic',
                  color: regPortal ? 'success.light' : 'error.dark',
                },
              }}
              control={
                <Switch
                  size='small'
                  checked={regPortal}
                  onChange={() => changeRegPortal(id, regPortal)}
                  name='on'
                />
              }
              label='Reg portal'
            />
            <FormControlLabel
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '.8rem',
                  fontWeight: 'bolder',
                  fontStyle: 'italic',
                  color: roll ? 'success.light' : 'error.dark',
                },
              }}
              control={
                <Switch
                  size='small'
                  checked={roll}
                  onChange={() => changeFieldPermit(id, roll, 'roll')}
                  name='roll'
                />
              }
              label='Roll field'
            />
            {/*           
            <FormControlLabel
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '.8rem',
                  fontWeight: 'bolder',
                  fontStyle: 'italic',
                  color: t_shirt ? 'success.light' : 'error.dark',
                },
              }}
              control={
                <Switch
                  size='small'
                  checked={t_shirt}
                  onChange={() => changeFieldPermit(id, t_shirt, 't_shirt')}
                  name='t_shirt'
                />
              }
              label='T-Shirt field'
            /> */}
          </Box>
          {submission.name && (
            <>
              <Typography
                fontSize={'.85rem'}
                fontWeight={'500'}
                fontStyle={'italic'}
                pl={2}
              >
                submission info :
              </Typography>
              <Stack
                sx={{ maxWidth: '90%', margin: '5px auto' }}
                p={1}
                flexDirection='row'
                columnGap={2}
                rowGap={0.5}
                flexWrap={'wrap'}
                bgcolor={'secondary.light'}
                width={'max-content'}
              >
                <InfoTypography
                  label={'type'}
                  color='semiWhite.main'
                  info={submission.type}
                />
                <InfoTypography
                  label={'name'}
                  color='semiWhite.main'
                  info={submission.name}
                />
                {submission.type === 'file' && (
                  <InfoTypography
                    label={'size'}
                    color='semiWhite.main'
                    info={submission.size || '500 kb'}
                  />
                )}
              </Stack>
            </>
          )}
        </Box>
      </Grid>
      <Grid
        p={2}
        sx={{ display: { xs: 'none', md: 'block' } }}
        item
        xs={12}
        md={2.5}
      >
        <Typography variant='body2' sx={{ fontSize: '.75rem' }}>
          {seeMoreDesc ? description : description.substring(0, 350)}
        </Typography>
        {description.length > 350 && (
          <Typography
            color={'secondary.light'}
            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setSeeMoreDesc(!seeMoreDesc)}
            fontSize='.8rem'
          >
            {seeMoreDesc ? '...see less' : '...see more'}
          </Typography>
        )}
      </Grid>
      <Grid
        p={2}
        sx={{ display: { xs: 'none', md: 'block' } }}
        item
        xs={12}
        md={2.5}
      >
        <ol>
          {rules
            .split('~~')
            .slice(0, seeMoreDesc ? ruleLength : 3)
            .map((rule, key) => {
              return rule ? (
                <li
                  style={{
                    fontSize: '.8rem',
                    marginBottom: '3px',
                    wordBreak: 'break-word',
                  }}
                  key={key}
                >
                  <ReactMarkdown>{rule}</ReactMarkdown>
                </li>
              ) : (
                ''
              )
            })}
          {ruleLength > 4 && (
            <Typography
              color={'secondary.light'}
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setSeeMoreDesc(!seeMoreDesc)}
              fontSize='.8rem'
            >
              {seeMoreDesc ? '...see less' : '...see more'}
            </Typography>
          )}
        </ol>
      </Grid>
    </Grid>
  )
}

export default EventItem
