import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAdminFetch } from '../../../custom_hooks/useAdminFetch'
import reqs, { reqImgWrapper } from '../../../data/requests'
import {
  SplitTypography,
  UnderlinedTypo,
} from '../../../global_components/Typographies'
import { AdminSettingContextConsumer } from '../../pages/Settings'
import Delete from '@mui/icons-material/Delete'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { ModalWithForm } from '../../../global_components/Modals'
import {
  ImgField,
  InputField,
  InputTextField,
} from '../../../global_components/FormControls'
import { useForm } from '../../../custom_hooks/useForm'
import { handleCompressImg } from '../../../Utils/imgCompressor'
import axios from 'axios'
import { objToFormData } from '../../../Utils/formFunctions'
import AddBoxIcon from '@mui/icons-material/AddBox'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { handleDeleteSetting } from './SettingFuncs'
import { StyledLink } from '../../../customStyles/StyledLinks'
import { memo } from 'react'

const PageSetting = () => {
  const { setAlertMsg } = AdminSettingContextConsumer()
  const { data } = useAdminFetch(reqs.GET_ALL_SETTING, setAlertMsg)
  const [setting, setSetting] = useState({})
  const { values, setValues, handleInputChange } = useForm({
    title: '',
    phones: '',
    gmails: '',
    titleDesc: '',
    banner: {},
    bkash: '',
    intro: '',
  })
  const [err, setErr] = useState({ all: '' })
  const [formMode, setFormMode] = useState('')
  const [isCompress, setIsCompress] = useState(true)

  useEffect(() => {
    setSetting(() => {
      return { ...(data.result ? data.result[0] : {}) }
    })
  }, [data])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!values.banner.type && formMode !== 'edit') {
      setErr({ all: 'banner image must be provided' })
    } else if (formMode !== 'edit') {
      let fd, req
      if (formMode === 'create') {
        fd = objToFormData(values)
        req = reqs.EVENT_SETTING_CREATOR
      } else if (formMode === 'updateImg') {
        fd = new FormData()
        fd.append('banner', values.banner)
        req = reqs.UPDATE_BANNER
      }
      axios
        .post(req, fd, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          if (res.data.succeed) {
            if (formMode === 'create') {
              setSetting(res.data.result)
              setAlertMsg({
                msg: 'Successfully launched the event',
                severity: 'success',
              })
            } else if (formMode === 'updateImg') {
              setSetting((setting) => {
                return {
                  ...setting,
                  image: '',
                }
              })
            }

            setFormMode('')
            setErr({ all: '' })
          }
        })
        .catch((error) => {
          setErr((err) => {
            return { ...err, all: error.response.data.msg }
          })
        })
    } else if (formMode === 'edit') {
      const { title, phones, gmails, titleDesc, bkash, intro } = values
      axios
        .put(
          `${reqs.EDIT_EVENT_SETTING}${setting.id}`,
          { title, phones, gmails, titleDesc, bkash, intro },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.succeed)
            setSetting((setting) => {
              return {
                ...setting,
                title,
                phones,
                gmails,
                titleDesc,
                bkash,
                intro,
              }
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

  const handlePermits = (label, type) => {
    axios
      .patch(
        `${reqs.SET_PERMIT}${setting.id}`,
        {
          permitName: label,
          permitType: !type,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setSetting((setting) => {
            return { ...setting, [label]: !type }
          })
        }
      })
      .catch((err) => {
        setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  return (
    <Box p={1}>
      <Stack pb={1} flexDirection='row' justifyContent={'space-between'}>
        <UnderlinedTypo
          text={'Current Event'}
          color={'secondary.light'}
          variant={'h5'}
          underlined={false}
        />

        <Stack flexDirection={'row'}>
          {setting.title ? (
            <>
              <IconButton
                onClick={() => handleDeleteSetting(setting.id, setSetting)}
                aria-label='delete'
                color='primary'
              >
                <Delete color={'error'} />
              </IconButton>
              <IconButton
                onClick={() => {
                  const { title, phones, gmails, titleDesc, bkash, intro } =
                    setting
                  setValues((values) => {
                    return {
                      ...values,
                      title,
                      phones,
                      gmails,
                      titleDesc,
                      bkash,
                      intro,
                    }
                  })
                  setFormMode('edit')
                }}
                aria-label='edit'
                color='primary'
              >
                <EditOutlinedIcon color={'primary'} />
              </IconButton>
              <IconButton
                onClick={() => setFormMode('updateImg')}
                aria-label='edit'
                color='primary'
              >
                <AddPhotoAlternateIcon color={'success'} />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={() => setFormMode('create')}
              aria-label='edit'
              color='primary'
            >
              <AddBoxIcon color={'info'} />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Card sx={{ width: '100%', boxShadow: 0 }}>
        {setting.title ? (
          <>
            <CardMedia
              component='img'
              height='250'
              image={
                setting.image
                  ? reqImgWrapper(setting.image)
                  : URL.createObjectURL(values.banner) || ''
              }
              alt='green iguana'
            />
            <CardContent>
              <Typography
                align='left'
                gutterBottom
                variant='h5'
                textTransform={'uppercase'}
                component='div'
                mt={1}
              >
                {setting.title}
              </Typography>
              <Typography align='left' variant='body2' color='text.secondary'>
                <b>Title Desc :</b>
                <br />
                {setting.titleDesc}
              </Typography>

              <SplitTypography infos={setting.gmails} title='Gmails' />
              <SplitTypography infos={setting.phones} title='Phones' />
              <SplitTypography infos={setting.bkash} title='bkash no.' />
              <Typography
                align='left'
                color={'secondary.light'}
                fontSize='14px'
                fontWeight={500}
                mt={1}
              >
                intro video:{' '}
                <StyledLink href={setting.intro} target='_blank'>
                  {setting.intro && setting.intro.slice(0, 25)}...
                </StyledLink>
              </Typography>
            </CardContent>
            <CardActions>
              <Stack
                width={'100%'}
                justifyContent={'space-between'}
                flexWrap={'wrap'}
                flexDirection={'row'}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={setting.caRegPermit}
                      onChange={() =>
                        handlePermits('caRegPermit', setting.caRegPermit)
                      }
                      name='on'
                    />
                  }
                  label='CA reg permit'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={setting.parRegPermit}
                      onChange={() =>
                        handlePermits('parRegPermit', setting.parRegPermit)
                      }
                      name='on'
                    />
                  }
                  label='Reg permit (All)'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={setting.searchPermit}
                      onChange={() =>
                        handlePermits('searchPermit', setting.searchPermit)
                      }
                      name='on'
                    />
                  }
                  label='Search permit'
                />
              </Stack>
            </CardActions>
          </>
        ) : (
          `No event launched!!`
        )}
      </Card>

      {/* modal */}
      <ModalWithForm
        text={
          formMode === 'create'
            ? 'Launch an Event!!'
            : formMode === 'edit'
            ? 'Edit Page Setting!!'
            : formMode === 'updateImg'
            ? 'Update Image!!'
            : ''
        }
        handleFormSubmit={handleFormSubmit}
        enc={formMode === 'edit' ? false : true}
        error={err.all}
        formMode={formMode}
        setFormMode={setFormMode}
      >
        {!(formMode === 'updateImg') && !(formMode === '') ? (
          <Stack
            sx={{ width: '100%' }}
            columnGap={3}
            flexDirection={'row'}
            p={1}
          >
            <Stack width={'50%'}>
              <InputField
                errMsg={err.title}
                label={'Title'}
                name={'title'}
                value={values.title}
                onChange={handleInputChange}
              />
              <InputTextField
                errMsg={err.phones}
                label={'Phones'}
                name={'phones'}
                value={values.phones}
                onChange={handleInputChange}
                rows={2}
                placeholder='01XXXXXXXXX , 01XXXXXXXXXX'
              />
              <InputTextField
                label={'bkash no.'}
                name={'bkash'}
                value={values.bkash}
                required={false}
                onChange={handleInputChange}
                placeholder='01XXXXXXXXX , 01XXXXXXXXXX'
              />
              <InputTextField
                label={'intro video link'}
                name={'intro'}
                value={values.intro}
                required={false}
                onChange={handleInputChange}
                rows={2}
                placeholder='https://...'
              />
            </Stack>

            <Stack width={'50%'}>
              <InputTextField
                errMsg={err.gmails}
                label={'Gmails'}
                name={'gmails'}
                value={values.gmails}
                onChange={handleInputChange}
                rows={2}
                placeholder='ex@gmail.com , ex@gmail.com'
              />
              <InputTextField
                errMsg={err.titleDesc}
                label={'Title Description'}
                name={'titleDesc'}
                value={values.titleDesc}
                onChange={handleInputChange}
                rows={3}
              />
            </Stack>
          </Stack>
        ) : (
          ''
        )}

        {formMode === 'create' || formMode === 'updateImg' ? (
          <Stack p={1} flexDirection={'column'} gap={2} alignItems={'center'}>
            <Stack
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              width={'100%'}
            >
              <ImgField
                label={'Banner'}
                name={'banner'}
                onChange={async (e) => {
                  let compressedImg = e.target.files[0]
                  if (isCompress) {
                    compressedImg = await handleCompressImg(
                      e.target.files[0],
                      0.15,
                      1920
                    )
                  }

                  setValues((values) => {
                    return {
                      ...values,
                      [e.target.name]: compressedImg,
                    }
                  })
                }}
              />
              <FormControlLabel
                label='auto compress'
                control={
                  <Checkbox
                    checked={isCompress}
                    onChange={() => setIsCompress(!isCompress)}
                  />
                }
              />
            </Stack>
            <ImgViewer file={values.banner} />
          </Stack>
        ) : (
          ''
        )}
      </ModalWithForm>
    </Box>
  )
}

const ImgViewer = memo(({ file }) => {
  return (
    <img
      style={{
        objectFit: 'contain',
        maxWidth: '600px',
        width: 'fit-content',
      }}
      height={350}
      src={file.type ? window.URL.createObjectURL(file) : '/Images/imgP.png'}
      loading='lazy'
      alt='banner'
    />
  )
})

export default PageSetting
