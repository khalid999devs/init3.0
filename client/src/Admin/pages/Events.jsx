import EventItem from '../components/Events/EventItem'
import {
  Autocomplete,
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material'
import axios from 'axios'
import AddIcon from '@mui/icons-material/Add'
import { memo, useEffect, useState } from 'react'
import { useAdminFetch } from '../../custom_hooks/useAdminFetch'
import { useForm } from '../../custom_hooks/useForm'
import reqs from '../../data/requests'
import { UnderlinedTypo } from '../../global_components/Typographies'
import { objToFormData } from '../../Utils/formFunctions'
import { ModalWithForm } from '../../global_components/Modals'
import { ImgField, SelectOptions } from '../../global_components/FormControls'
import { handleCompressImg } from '../../Utils/imgCompressor'
import { AlertModal } from '../../global_components/Alerts'
import AddBoxIcon from '@mui/icons-material/AddBox'

const Events = () => {
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })

  const { data } = useAdminFetch(reqs.ALL_EVENTS_DATA, setAlertMsg)
  const [events, setEvents] = useState([])
  const [eventCategory, setCategory] = useState([])
  const { values, setValues, handleInputChange } = useForm({
    name: '',
    category: '',
    timeRange: '',
    videoLink: '',
    description: '',
    event: {},
    value: '',
    type: 'offline',
    paid: false,
    fee: 0,
    team: false,
    maxMember: '',
    place: '',
    submission: {
      type: 'link',
      name: '',
      size: '',
    },
    rules: '',
    date: '',
    id: 0,
  })
  const [singleRule, setSingleRule] = useState('')
  const [err, setErr] = useState({ all: '', size: '' })
  const [formMode, setFormMode] = useState('')

  useEffect(() => {
    setEvents(() => {
      return [...(data.result ? data.result : [])]
    })

    if (data.result)
      setCategory([
        ...new Set(
          data.result.map((event) => {
            return event.category
          })
        ),
      ])
  }, [data])

  const deleteEvent = (id) => {
    axios
      .delete(`${reqs.DELETE_EVENT}${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed)
          setEvents(events.filter((event) => event.id !== id))
      })
      .catch((error) =>
        setAlertMsg({ msg: error.response.data.msg, severity: 'error' })
      )
  }

  const changeRegPortal = (id, type) => {
    axios
      .patch(
        `${reqs.UPDATE_REG_PORTAL}${id}`,
        { type: !type },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setEvents(
            events.map((event) => {
              if (event.id === id) event.regPortal = !type
              return event
            })
          )
        }
      })
      .catch((err) => {
        setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  const changeFieldPermit = (id, type, name) => {
    axios
      .patch(
        `${reqs.UPDATE_FIELD_PERMIT}${id}`,
        { type: !type, fieldName: name },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setEvents(
            events.map((event) => {
              if (event.id === id) event[name] = !type
              return event
            })
          )
        }
      })
      .catch((err) => {
        setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  function afterReqFunc() {
    setErr({ all: '', size: '' })
    setFormMode('')
    setValues({
      name: '',
      category: '',
      timeRange: '',
      videoLink: '',
      description: '',
      event: {},
      value: '',
      type: 'offline',
      paid: false,
      fee: 0,
      team: false,
      maxMember: '',
      place: '',
      submission: {
        type: 'link',
        name: '',
        size: '',
      },
      rules: '',
      date: '',
      id: 0,
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // console.log(values)
    if (
      (formMode === 'create' || formMode === 'imgEdit') &&
      values.event.type
    ) {
      let fd
      if (formMode === 'create') {
        delete values.id
        const data = {
          ...values,
          maxMember: values.maxMember || 0,
          timeRange: values.timeRange || null,
          place: values.place || null,
          submission: JSON.stringify(values.submission),
        }
        fd = objToFormData(data)
      } else if (formMode === 'imgEdit') {
        fd = new FormData()
        fd.append('name', values['name'])
        fd.append('event', values['event'])
      }

      axios[`${formMode === 'create' ? 'post' : 'patch'}`](
        `${
          formMode === 'create'
            ? reqs.ADD_EVENT
            : `${reqs.EDIT_EVENT_IMG}${values.id}`
        }`,
        fd,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
        .then((res) => {
          if (res.data.succeed) {
            // console.log(res)
            if (formMode === 'create') {
              setEvents((events) => {
                return [res.data.result, ...events]
              })
            } else if (formMode === 'imgEdit') {
              setEvents(
                events.map((event) => {
                  if (event.id === values.id) {
                    event.image = res.data.result
                  }
                  return event
                })
              )
            }
          }
          afterReqFunc()
        })
        .catch((error) => {
          setErr((err) => {
            return { ...err, all: error.response.data.msg }
          })
        })
    } else if (formMode === 'edit') {
      axios
        .patch(
          `${reqs.EDIT_EVENT}${values.id}`,
          {
            ...values,
            submission: JSON.stringify(values.submission),
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.succeed) {
            setEvents(
              events.map((event) => {
                if (event.id === values.id) {
                  const newObj = { ...values }
                  return newObj
                } else return event
              })
            )
          }
          afterReqFunc()
        })
        .catch((error) => {
          setErr((err) => {
            return { ...err, all: error.response.data.msg }
          })
        })
    } else {
      setAlertMsg({ msg: 'image must be provided', severity: 'error' })
    }
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
          text={'Events (running Contests)'}
          color={'darkBlue.main'}
          variant={'h4'}
          underlined={false}
        />
        <IconButton onClick={() => setFormMode('create')} aria-label='edit'>
          <AddBoxIcon sx={{ fontSize: '2rem' }} color={'info'} />
        </IconButton>
      </Stack>
      <Stack
        flexDirection={'row'}
        pt={2}
        flexWrap='wrap'
        columnGap={2}
        rowGap={1}
        sx={{
          justifyContent: {
            xs: 'center',
            md: 'flex-start',
          },
        }}
      >
        {events.length < 1 && <strong>No running contest...</strong>}
        {events.map((event, value) => {
          return (
            <EventItem
              key={value}
              eventObj={event}
              setValues={setValues}
              setFormMode={setFormMode}
              values={values}
              deleteEvent={deleteEvent}
              changeRegPortal={changeRegPortal}
              changeFieldPermit={changeFieldPermit}
            />
          )
        })}
      </Stack>

      {/* modal */}
      <ModalWithForm
        text={
          formMode === 'create'
            ? 'Add new event!!'
            : formMode === 'edit'
            ? 'Edit event !!'
            : formMode === 'imgEdit'
            ? 'Change Event Img!!'
            : ''
        }
        handleFormSubmit={handleFormSubmit}
        enc={formMode === 'edit' ? false : true}
        error={err.all}
        formMode={formMode}
        setFormMode={setFormMode}
      >
        {formMode !== 'imgEdit' && (
          <>
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'auto auto auto',
                rowGap: 2,
                columnGap: 1,
              }}
              p={1}
            >
              <TextField
                sx={{ minWidth: '150px' }}
                value={values.name}
                label={'name'}
                onChange={handleInputChange}
                placeholder={'ex event'}
                name={'name'}
                size='small'
                variant='outlined'
                required
              />
              <TextField
                value={values.value}
                label={'value'}
                onChange={handleInputChange}
                placeholder={'exEvent'}
                name={'value'}
                size='small'
                variant='outlined'
                required
              />
              <Autocomplete
                disableClearable
                disablePortal
                freeSolo
                id='combo-box-demo'
                value={values.category}
                options={eventCategory}
                sx={{ width: 300 }}
                onChange={(e, value) => {
                  setValues((values) => {
                    return { ...values, category: value }
                  })
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size={'small'}
                    name='category'
                    label='category'
                    onChange={(e) => {
                      setValues((values) => {
                        return { ...values, category: e.target.value }
                      })
                    }}
                    required
                  />
                )}
              />

              <TextField
                value={values.timeRange}
                label={'time-range'}
                onChange={handleInputChange}
                placeholder={'1200-1400'}
                name={'timeRange'}
                size='small'
                variant='outlined'
              />
              <TextField
                value={values.date.replaceAll('/', '-')}
                onChange={(e) =>
                  setValues((values) => {
                    return {
                      ...values,
                      date: e.target.value.replaceAll('-', '/'),
                    }
                  })
                }
                type='date'
                name={'date'}
                size='small'
                variant='outlined'
              />

              <TextField
                value={values.place}
                label={'place'}
                onChange={handleInputChange}
                placeholder={'room no. XXX..'}
                name={'place'}
                size='small'
                variant='outlined'
              />

              <TextField
                value={values.videoLink}
                label={'link'}
                onChange={handleInputChange}
                placeholder={'https://...'}
                name={'videoLink'}
                size='small'
                type={'url'}
                variant='outlined'
                required
              />
              {formMode === 'create' && (
                <FormControl>
                  <SelectOptions
                    ops={{
                      value: values.type,
                      options: [
                        { name: 'online', value: 'online' },
                        { name: 'offline', value: 'offline' },
                      ],
                      label: 'type',
                      handleOptionChange: (e) =>
                        setValues((values) => {
                          return { ...values, type: e.target.value }
                        }),
                    }}
                  />
                </FormControl>
              )}

              <TextField
                value={values.description}
                label={'description'}
                onChange={handleInputChange}
                placeholder={'event desc...'}
                name={'description'}
                size='small'
                variant='outlined'
                required
                multiline
                maxRows={2}
              />

              {formMode === 'create' && (
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size='small'
                        checked={values.paid}
                        onChange={() =>
                          setValues((values) => {
                            return { ...values, paid: !values.paid }
                          })
                        }
                      />
                    }
                    label='paid?'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size='small'
                        checked={values.team}
                        onChange={() =>
                          setValues((values) => {
                            return { ...values, team: !values.team }
                          })
                        }
                      />
                    }
                    label='team?'
                  />
                </Box>
              )}

              {values.paid && (
                <TextField
                  value={values.fee}
                  label={'fee'}
                  onChange={handleInputChange}
                  placeholder={'100tk'}
                  name={'fee'}
                  size='small'
                  variant='outlined'
                />
              )}
              {values.team && formMode === 'create' && (
                <TextField
                  value={values.maxMember}
                  label={'max-member'}
                  type='number'
                  onChange={handleInputChange}
                  placeholder={'3'}
                  name={'maxMember'}
                  size='small'
                  variant='outlined'
                />
              )}
              {values.type === 'online' && (
                <FormControl>
                  <SelectOptions
                    ops={{
                      value: values.submission.type,
                      options: [
                        { name: 'link', value: 'link' },
                        { name: 'file', value: 'file' },
                      ],
                      defValue: 'link',
                      label: 'sub-type',
                      handleOptionChange: (e) =>
                        setValues((values) => {
                          return {
                            ...values,
                            submission: {
                              ...values.submission,
                              type: e.target.value,
                            },
                          }
                        }),
                    }}
                  />
                </FormControl>
              )}

              {values.type === 'online' && (
                <>
                  <TextField
                    sx={{ minWidth: '250px' }}
                    value={values.submission.name}
                    label={'link-name'}
                    onChange={(e) => {
                      setValues((values) => {
                        return {
                          ...values,
                          submission: {
                            ...values.submission,
                            name: e.target.value,
                          },
                        }
                      })
                    }}
                    placeholder={
                      'image(.jpg,..all),.txt,.ppdf../drive,github...'
                    }
                    helperText='use comma for multiple (no spaces)'
                    name={'name'}
                    size='small'
                    variant='outlined'
                  />

                  {values.submission.type === 'file' && (
                    <TextField
                      value={values.submission.size}
                      label={'file-size (max: 1000 kb)'}
                      onChange={(e) => {
                        setValues((values) => {
                          return {
                            ...values,
                            submission: {
                              ...values.submission,
                              size: e.target.value,
                            },
                          }
                        })
                      }}
                      error={values.submission.size > 1000}
                      placeholder='100,200...'
                      helperText={
                        err.size
                          ? err.size
                          : values.submission.size > 1000
                          ? 'must be under 1000'
                          : 'same numbered to files'
                      }
                      name={'size'}
                      size='small'
                      variant='outlined'
                    />
                  )}
                </>
              )}
            </Box>

            <Box sx={{ margin: '10px auto', width: '98%' }}>
              {formMode === 'edit' && (
                <TextField
                  value={values.rules}
                  label={'rules(here ~~ represents end of each rule)'}
                  onChange={handleInputChange}
                  name={'rules'}
                  focused
                  helperText='do not erase ~~ unless you want to merge or delete the rule'
                  fullWidth
                  multiline
                  size='small'
                  variant='outlined'
                />
              )}
              {formMode === 'create' && (
                <>
                  <FormControl fullWidth variant='outlined'>
                    <InputLabel
                      size='small'
                      htmlFor='outlined-adornment-password'
                    >
                      rules*
                    </InputLabel>
                    <OutlinedInput
                      fullWidth
                      id='outlined-adornment-password'
                      value={singleRule}
                      size='small'
                      onChange={(e) => setSingleRule(e.target.value)}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={() =>
                              setValues((values) => {
                                return {
                                  ...values,
                                  rules: singleRule + '~~' + values.rules,
                                }
                              })
                            }
                            edge='end'
                          >
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      label='Password'
                    />
                  </FormControl>
                  {values.rules && (
                    <ol
                      style={{
                        marginLeft: '20px',
                        lineHeight: '15px',
                        fontSize: '.82rem',
                        marginTop: '5px',
                        letterSpacing: '.5px',
                      }}
                    >
                      {values.rules
                        .split('~~')
                        .slice(0, 4)
                        .map((rule, key) => {
                          return rule ? (
                            <li
                              style={{
                                fontFamily: 'Titillium Web, sans-serif',
                              }}
                              key={key}
                            >
                              {rule}
                            </li>
                          ) : (
                            ''
                          )
                        })}
                      {values.rules.split('~~').length > 5 && '...'}
                    </ol>
                  )}
                </>
              )}
            </Box>
          </>
        )}

        {formMode === 'create' || formMode === 'imgEdit' ? (
          <Stack p={1} flexDirection={'row'} gap={2}>
            <ImgField
              label={'Image'}
              name={'image'}
              onChange={async (e) => {
                const event = await handleCompressImg(
                  e.target.files[0],
                  0.1,
                  1920
                )
                setValues((values) => {
                  return {
                    ...values,
                    event: event,
                  }
                })
              }}
            />
            <ImgViewer file={values.event} />
          </Stack>
        ) : (
          ''
        )}
      </ModalWithForm>
    </Container>
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
      height={250}
      src={file.type ? window.URL.createObjectURL(file) : '/Images/imgP.png'}
      loading='lazy'
      alt='event '
    />
  )
})

export default Events
