import {
  IconButton,
  Stack,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { UnderlinedTypo } from '../../../global_components/Typographies'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useEffect, useState } from 'react'
import { useAdminFetch } from '../../../custom_hooks/useAdminFetch'
import { ModalWithForm } from '../../../global_components/Modals'
import { InputTextField } from '../../../global_components/FormControls'
import { AdminSettingContextConsumer } from '../../pages/Settings'
import reqs from '../../../data/requests'
import { useForm } from '../../../custom_hooks/useForm'
import EditOutlined from '@mui/icons-material/EditOutlined'
import Delete from '@mui/icons-material/Delete'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const Faq = () => {
  const { setAlertMsg } = AdminSettingContextConsumer()
  const { data } = useAdminFetch(reqs.ALL_NOTICES, setAlertMsg)
  const [notices, setNotices] = useState([])
  const { values, setValues, handleInputChange } = useForm({
    type: '',
    message: '',
    id: '',
  })
  const [err, setErr] = useState({ all: '' })
  const [formMode, setFormMode] = useState('')

  useEffect(() => {
    setNotices(() => {
      return [...(data.result ? data.result : [])]
    })
  }, [data])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const reqType = formMode === 'create' ? 'post' : 'put'
    const req =
      formMode === 'create'
        ? reqs.CREATE_NOTICE
        : `${reqs.UPDATE_NOTICE}${values.id}`
    const { type, message } = values
    axios[`${reqType}`](req, { type, message }, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          if (formMode === 'create') {
            setNotices((notices) => {
              return [...notices, res.data.result]
            })
            setValues({ ques: '', ans: '' })
          } else if (formMode === 'edit') {
            setNotices((notices) => {
              const modifiedNotices = notices.map((notice) => {
                if (notice.id === values.id) {
                  notice.type = values.type
                  notice.message = values.message
                }
                return notice
              })
              return modifiedNotices
            })
          }
        }
        setFormMode('')
        setErr({ all: '' })
      })
      .catch((err) => {
        setErr({ all: err.response.data.msg })
      })
  }

  const handleDeleteFaq = (id) => {
    axios
      .delete(`${reqs.DELETE_NOTICE}${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setNotices((notices) => notices.filter((notice) => notice.id !== id))
        }
      })
      .catch((err) => {
        setErr({ all: err.response.data.msg })
      })
  }

  const handlWarn = (id, warn) => {
    axios
      .patch(
        `${reqs.WARN_NOTICE}${id}`,
        { warn: warn ? 0 : 1 },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setNotices((notices) => {
            const modifiedNotices = notices.map((notice) => {
              if (notice.id === id) {
                notice.warn = !warn
              }
              return notice
            })
            return modifiedNotices
          })
        }
        setErr({ all: '' })
      })
      .catch((err) => setErr({ all: err.response.data.msg }))
  }

  return (
    <Box p={1}>
      <Stack pb={1} flexDirection='row' justifyContent={'space-between'}>
        <UnderlinedTypo
          text={'Notices'}
          color={'secondary.light'}
          variant={'h5'}
          underlined={false}
        />

        <IconButton
          onClick={() => {
            setFormMode('create')
            setValues({ ques: '', ans: '' })
          }}
          aria-label='edit'
          color='primary'
        >
          <AddBoxIcon color={'info'} />
        </IconButton>
      </Stack>
      <Stack>
        {notices.map((notice) => {
          return (
            <Card
              key={notice.id}
              sx={{
                minWidth: 275,
                backgroundColor: 'primary.light',
                color: 'semiWhite.main',
                mb: 1,
              }}
            >
              <CardContent sx={{ paddingBottom: 0 }}>
                <Typography
                  variant='subtitle1'
                  pb={1}
                  color={'info.main'}
                  align='left'
                  component='h6'
                  fontWeight={600}
                >
                  {notice.type}
                </Typography>
                <Typography
                  sx={{ opacity: '.7' }}
                  variant='body2'
                  pb={1}
                  align='left'
                  component={'div'}
                >
                  <ReactMarkdown>{notice.message}</ReactMarkdown>
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  paddingTop: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>
                  <IconButton
                    onClick={() => {
                      const { id, type, message } = notice

                      setValues((values) => {
                        return { ...values, id, type, message }
                      })
                      setFormMode('edit')
                    }}
                    aria-label='edit'
                  >
                    <EditOutlined color={'info'} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleDeleteFaq(notice.id)
                    }}
                    aria-label='edit'
                  >
                    <Delete color={'error'} />
                  </IconButton>
                </span>

                <FormControlLabel
                  control={
                    <Switch
                      color='semiWhite'
                      checked={notice.warn}
                      onChange={() => {
                        handlWarn(notice.id, notice.warn)
                      }}
                      name='on'
                    />
                  }
                  label='Warn'
                />
              </CardActions>
            </Card>
          )
        })}
      </Stack>
      {/* Modal */}
      <ModalWithForm
        text={
          formMode === 'create'
            ? 'Set a Notice!!'
            : formMode === 'edit'
            ? 'Edit Notice'
            : ''
        }
        handleFormSubmit={handleFormSubmit}
        enc={false}
        error={err.all}
        formMode={formMode}
        setFormMode={setFormMode}
      >
        <Box p={2}>
          <InputTextField
            errMsg={err.ques}
            label={'Type'}
            name={'type'}
            value={values.type}
            onChange={handleInputChange}
          />
          <InputTextField
            errMsg={err.ans}
            label={'Message'}
            name={'message'}
            value={values.message}
            onChange={handleInputChange}
          />
        </Box>
      </ModalWithForm>
    </Box>
  )
}

export default Faq
