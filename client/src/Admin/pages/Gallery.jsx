import {
  Container,
  FormControl,
  IconButton,
  Stack,
  TextField,
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAdminFetch } from '../../custom_hooks/useAdminFetch'
import { useForm } from '../../custom_hooks/useForm'
import reqs from '../../data/requests'
import { UnderlinedTypo } from '../../global_components/Typographies'
import GalleryItem from '../components/Gallery/GalleryItem'
import { objToFormData } from '../../Utils/formFunctions'
import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate'
import { ModalWithForm } from '../../global_components/Modals'
import { ImgField, SelectOptions } from '../../global_components/FormControls'
import { handleCompressImg } from '../../Utils/imgCompressor'
import { AlertModal } from '../../global_components/Alerts'

const rowColOption = [
  { name: 1, value: 1 },
  { name: 2, value: 2 },
  { name: 3, value: 3 },
  { name: 4, value: 4 },
]

const Gallery = () => {
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })

  const { data } = useAdminFetch(reqs.ALL_GALLERY_IMG, setAlertMsg)
  const [images, setImages] = useState([])
  const { values, setValues, handleInputChange } = useForm({
    gallery: {},
    thumbnail: {},
    rows: 1,
    cols: 1,
    order: data.length,
    id: '',
  })

  const [err, setErr] = useState({ all: '' })
  const [formMode, setFormMode] = useState('')

  useEffect(() => {
    setImages(() => {
      return [...(data.result ? data.result : [])]
    })
  }, [data])

  const handleGallerySubmit = (e) => {
    e.preventDefault()
    const { gallery, thumbnail, rows, cols, order, id } = values

    if (formMode === 'create' && gallery.type && thumbnail.type) {
      const fd = objToFormData({ gallery, thumbnail, rows, cols, order })
      axios
        .post(reqs.ADD_GALLERY_IMG, fd, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          if (res.data.succeed) {
            setImages((images) => {
              return [...images, res.data.result]
            })
          }
          setErr({ all: '' })
          setFormMode('')
          setValues({
            gallery: {},
            thumbnail: {},
            rows: 1,
            cols: 1,
            order: 1,
            id: '',
          })
        })
        .catch((error) => {
          setErr({ all: error.response.data.msg })
        })
    } else if (formMode === 'edit') {
      axios
        .patch(
          `${reqs.UPDATE_GALLERY_IMG}${id}`,
          { rows, cols, order },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.succeed)
            setImages((images) => {
              return images.map((image) => {
                if (image.id === id) {
                  image.rows = rows
                  image.cols = cols
                  image.order = order
                }
                return image
              })
            })
          setErr({ all: '' })
          setFormMode('')
        })
        .catch((error) => {
          setErr({ all: error.response.data.msg })
        })
    } else {
      setErr({ all: 'You must provide the image file' })
    }
  }

  const deleteGalleryImg = (id) => {
    axios
      .delete(`${reqs.DELETE_GALLERY_IMG}${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed)
          setImages((images) => {
            return images.filter((image) => image.id !== id)
          })
      })
      .catch((error) => {
        setAlertMsg({ msg: error.response.data.msg, severity: 'error' })
      })
  }

  return (
    <Container
      sx={{
        padding: {
          xs: '0 10px 0 70px',
          xl: 0,
        },
      }}
      maxWidth={'lg'}
    >
      {alertMsg.msg && (
        <AlertModal
          openMode={true}
          text={alertMsg.msg}
          timeMs={1500}
          severity={alertMsg.severity}
          setAlertMsg={setAlertMsg}
        />
      )}
      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <UnderlinedTypo
          text={'Gallery Images'}
          color={'secondary.light'}
          variant={'h4'}
          underlined={false}
        />
        <IconButton onClick={() => setFormMode('create')} aria-label='edit'>
          <AddPhotoAlternate sx={{ fontSize: '2rem' }} color={'success'} />
        </IconButton>
      </Stack>
      <Stack
        flexDirection={'row'}
        p={2}
        flexWrap='wrap'
        columnGap={2}
        rowGap={3}
        sx={{
          justifyContent: {
            xs: 'center',
            md: 'flex-start',
          },
        }}
      >
        {images.map((image, key) => {
          return (
            <GalleryItem
              key={key}
              image={image}
              setValues={setValues}
              setFormMode={setFormMode}
              values={values}
              deleteItem={deleteGalleryImg}
            />
          )
        })}
      </Stack>

      {/* modal */}
      <ModalWithForm
        text={
          formMode === 'create'
            ? 'Add Gallery Image!!'
            : formMode === 'edit'
            ? 'Edit Gallery Image !!'
            : ''
        }
        handleFormSubmit={handleGallerySubmit}
        enc={formMode === 'edit' ? false : true}
        error={err.all}
        formMode={formMode}
        setFormMode={setFormMode}
      >
        <Stack
          sx={{ width: '100%' }}
          columnGap={3}
          flexDirection={'row'}
          justifyContent={'space-around'}
          p={1}
        >
          <FormControl sx={{ ml: 3 }}>
            <SelectOptions
              ops={{
                value: values.rows,
                defValue: 1,
                options: rowColOption,
                label: 'Rows',
                handleOptionChange: (e) => {
                  setValues((values) => {
                    return { ...values, rows: e.target.value }
                  })
                },
              }}
            />
          </FormControl>
          <FormControl sx={{ ml: 3 }}>
            <SelectOptions
              ops={{
                value: values.cols,
                defValue: 1,
                options: rowColOption,
                label: 'Cols',
                handleOptionChange: (e) => {
                  setValues((values) => {
                    return { ...values, cols: e.target.value }
                  })
                },
              }}
            />
          </FormControl>
          <TextField
            value={values.order}
            label={'order'}
            onChange={handleInputChange}
            placeholder={'2'}
            name={'order'}
            sx={{ width: '80px' }}
            size='small'
            variant='outlined'
          />
          {formMode === 'create' ? (
            <img
              style={{
                objectFit: 'contain',
                maxWidth: '150px',
                width: 'fit-content',
              }}
              src={
                values.gallery.type
                  ? window.URL.createObjectURL(values.thumbnail)
                  : '/Images/imgP.png'
              }
              loading='lazy'
              alt='thumbnail'
            />
          ) : (
            ''
          )}
        </Stack>

        {formMode === 'create' ? (
          <Stack p={1} flexDirection={'row'} gap={2}>
            <ImgField
              label={'Image'}
              name={'image'}
              onChange={async (e) => {
                const BigImage = await handleCompressImg(
                  e.target.files[0],
                  0.4,
                  1920
                )
                const thumbnail = await handleCompressImg(
                  e.target.files[0],
                  0.2,
                  800
                )
                setValues((values) => {
                  return {
                    ...values,
                    gallery: BigImage,
                    thumbnail: thumbnail,
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
                values.gallery.type
                  ? window.URL.createObjectURL(values.gallery)
                  : '/Images/imgP.png'
              }
              loading='lazy'
              alt='Big Image'
            />
          </Stack>
        ) : (
          ''
        )}
      </ModalWithForm>
    </Container>
  )
}

export default Gallery
