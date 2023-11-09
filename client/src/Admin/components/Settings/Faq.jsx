import {
  IconButton,
  Stack,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
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
  const { data } = useAdminFetch(reqs.ALL_FAQS, setAlertMsg)
  const [faqs, setFaqs] = useState([])
  const { values, setValues, handleInputChange } = useForm({
    ques: '',
    ans: '',
    id: '',
  })
  const [err, setErr] = useState({ all: '' })
  const [formMode, setFormMode] = useState('')

  useEffect(() => {
    setFaqs(() => {
      return [...(data.result ? data.result : [])]
    })
  }, [data])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const reqType = formMode === 'create' ? 'post' : 'put'
    const req =
      formMode === 'create' ? reqs.ADD_FAQ : `${reqs.EDIT_FAQ}${values.id}`
    const { ques, ans } = values
    axios[`${reqType}`](req, { ques, ans }, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          if (formMode === 'create') {
            setFaqs((faqs) => {
              return [...faqs, res.data.result]
            })
            setValues({ ques: '', ans: '' })
          } else if (formMode === 'edit') {
            setFaqs((faqs) => {
              const modifiedFaqs = faqs.map((faq) => {
                if (faq.id == values.id) {
                  faq.question = values.ques
                  faq.answer = values.ans
                }
                return faq
              })
              return modifiedFaqs
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
      .delete(`${reqs.DELETE_FAQ}${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setFaqs((faqs) => faqs.filter((faq) => faq.id != id))
        }
      })
      .catch((err) => {
        setErr({ all: err.response.data.msg })
      })
  }

  return (
    <Box p={1}>
      <Stack pb={1} flexDirection='row' justifyContent={'space-between'}>
        <UnderlinedTypo
          text={'FAQs'}
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
        {faqs.map((faq) => {
          return (
            <Card
              key={faq.id}
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
                  align='left'
                  component='h6'
                  fontWeight={600}
                >
                  <Typography
                    fontWeight={'bolder'}
                    color={'info.main'}
                    component={'span'}
                  >
                    {'>>'}
                  </Typography>{' '}
                  {faq.question}
                </Typography>
                <Typography
                  sx={{ opacity: '.7' }}
                  variant='body2'
                  pb={1}
                  align='left'
                  component={'div'}
                >
                  <ReactMarkdown>{faq.answer}</ReactMarkdown>
                </Typography>
              </CardContent>
              <CardActions sx={{ paddingTop: 0 }}>
                <IconButton
                  onClick={() => {
                    const { id, question, answer } = faq

                    setValues((values) => {
                      return { ...values, ques: question, ans: answer, id }
                    })
                    setFormMode('edit')
                  }}
                  aria-label='edit'
                >
                  <EditOutlined color={'info'} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleDeleteFaq(faq.id)
                  }}
                  aria-label='edit'
                >
                  <Delete color={'error'} />
                </IconButton>
              </CardActions>
            </Card>
          )
        })}
      </Stack>
      {/* Modal */}
      <ModalWithForm
        text={
          formMode === 'create'
            ? 'Set a FAQ!!'
            : formMode === 'edit'
            ? 'Edit FAQ'
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
            label={'Question'}
            name={'ques'}
            value={values.ques}
            onChange={handleInputChange}
          />
          <InputTextField
            errMsg={err.ans}
            label={'Answer'}
            name={'ans'}
            value={values.ans}
            onChange={handleInputChange}
          />
        </Box>
      </ModalWithForm>
    </Box>
  )
}

export default Faq
