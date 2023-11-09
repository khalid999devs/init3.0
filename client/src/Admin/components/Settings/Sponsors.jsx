import { IconButton, Stack, Box, Typography, Grid } from '@mui/material'
import { UnderlinedTypo } from '../../../global_components/Typographies'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useEffect, useState } from 'react'
import { useAdminFetch } from '../../../custom_hooks/useAdminFetch'
import { ModalWithForm } from '../../../global_components/Modals'
import { InputField, ImgField } from '../../../global_components/FormControls'
import { AdminSettingContextConsumer } from '../../pages/Settings'
import reqs, { reqImgWrapper } from '../../../data/requests'
import { useForm } from '../../../custom_hooks/useForm'
import Delete from '@mui/icons-material/Delete'
import axios from 'axios'
import { handleCompressImg } from '../../../Utils/imgCompressor'
import { objToFormData } from '../../../Utils/formFunctions'
import { StyledLink } from '../../../customStyles/StyledLinks'

const Sponsors = () => {
  const { setAlertMsg } = AdminSettingContextConsumer()
  const { data } = useAdminFetch(reqs.GET_ALL_SPONSOR, setAlertMsg)
  const [sponsors, setSponsors] = useState([])
  const { values, setValues, handleInputChange } = useForm({
    type: '',
    link: '',
    name: '',
    sponsor: {},
  })
  const [err, setErr] = useState({ all: '' })
  const [formMode, setFormMode] = useState('')

  useEffect(() => {
    setSponsors(() => {
      return [...(data.result ? data.result : [])]
    })
  }, [data])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!values.sponsor.type) {
      setErr({ all: 'sponsor image must be provided' })
    } else {
      console.log(values)
      axios
        .post(reqs.ADD_SPONSOR, objToFormData(values), {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          if (res.data.succeed)
            setSponsors((sponsors) => {
              return [...sponsors, res.data.result]
            })
          setFormMode('')
          setErr({ all: '' })
        })
        .catch((error) =>
          setErr((err) => {
            return { ...err, all: error.response.data.msg }
          })
        )
    }
  }

  const handleDeleteSponsor = (id) => {
    axios
      .delete(`${reqs.DELETE_SPONSOR}${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setSponsors((sponsors) =>
            sponsors.filter((sponsor) => sponsor.id !== id)
          )
        }
      })
      .catch((err) => {
        setErr({ all: err.response.data.msg })
      })
  }

  return (
    <Box p={1} pb={3}>
      <Stack pb={1} flexDirection='row' justifyContent={'space-between'}>
        <UnderlinedTypo
          text={'Sponsors'}
          color={'secondary.light'}
          variant={'h5'}
          underlined={false}
        />

        <IconButton
          onClick={() => {
            setFormMode('create')
            setValues((values) => {
              return { ...values, type: '', link: '', name: '' }
            })
          }}
          aria-label='edit'
          color='primary'
        >
          <AddBoxIcon color={'info'} />
        </IconButton>
      </Stack>
      <Stack>
        {sponsors.map((sponsor) => {
          return (
            <Grid
              key={sponsor.id}
              sx={{ width: 'inherit' }}
              mt={1.5}
              container
              spacing={2}
            >
              <Grid item xs={4}>
                <img
                  height={'100%'}
                  width={'100%'}
                  style={{ maxHeight: '120px', objectFit: 'contain' }}
                  src={
                    sponsor.image
                      ? reqImgWrapper(sponsor.image)
                      : URL.createObjectURL(values.sponsor)
                  }
                  alt={sponsor.name}
                />
              </Grid>
              <Grid
                item
                xs={6.5}
                container
                alignItems={'center'}
                justifyContent={'flex-start'}
                textAlign={'left'}
              >
                <Box>
                  <Typography variant='subtitle1' fontWeight={600}>
                    {sponsor.type}
                  </Typography>
                  <Typography variant='body1'>{sponsor.name}</Typography>
                  <StyledLink target='_blank' href={sponsor.link}>
                    {sponsor.link}
                  </StyledLink>
                </Box>
              </Grid>
              <Grid item pr={1} container xs={1.5} alignItems={'center'}>
                <IconButton
                  onClick={() => {
                    handleDeleteSponsor(sponsor.id)
                  }}
                  aria-label='edit'
                >
                  <Delete color={'error'} />
                </IconButton>
              </Grid>
            </Grid>
          )
        })}
      </Stack>

      {/* modal */}
      <ModalWithForm
        text={formMode === 'create' ? 'Set a Sponsor!!' : ''}
        handleFormSubmit={handleFormSubmit}
        enc={true}
        error={err.all}
        formMode={formMode}
        setFormMode={setFormMode}
      >
        <Box p={2}>
          <Stack>
            <InputField
              label={'Type'}
              name={'type'}
              value={values.type}
              onChange={handleInputChange}
            />
            <InputField
              label={'Name'}
              name={'name'}
              value={values.name}
              onChange={handleInputChange}
            />

            <InputField
              label={'Link'}
              name={'link'}
              value={values.link}
              onChange={handleInputChange}
            />
          </Stack>

          <Stack p={1} flexDirection={'row'} gap={2}>
            <ImgField
              label={'Sponsor'}
              name={'sponsor'}
              onChange={async (e) => {
                const compressedImg = await handleCompressImg(
                  e.target.files[0],
                  0.06,
                  800
                )
                setValues((values) => {
                  return {
                    ...values,
                    [e.target.name]: compressedImg,
                  }
                })
              }}
            />
            <img
              style={{
                objectFit: 'contain',
                maxWidth: '600px',
                width: 'fit-content',
              }}
              height={350}
              src={
                values.sponsor.type
                  ? window.URL.createObjectURL(values.sponsor)
                  : 'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640'
              }
              loading='lazy'
              alt='Sponsor'
            />
          </Stack>
        </Box>
      </ModalWithForm>
    </Box>
  )
}

export default Sponsors
