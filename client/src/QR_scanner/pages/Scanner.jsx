import {
  Container,
  Stack,
  Box,
  IconButton,
  Typography,
  Avatar,
  Switch,
  FormControlLabel,
  FormControl,
} from '@mui/material'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import axios from 'axios'
import reqs from '../../data/requests'
import PerInfo from '../components/PerInfo'
import SearchBox from '../../Admin/components/ParAndCAInfo/SearchBox'
import { GlobalContextConsumer } from '../../GlobalContext'
import { AlertModal } from '../../global_components/Alerts'
import NoPhotographyIcon from '@mui/icons-material/NoPhotography'
import { CustomModal } from '../../global_components/Modals'
import { StyledLink } from '../../customStyles/StyledLinks'
import { SelectOptions } from '../../global_components/FormControls'

const beep = new Audio('sounds/beep.mp3')

const Scanner = () => {
  const [type, setType] = useState('scan')
  const [code, setCode] = useState('')
  const [err, setErr] = useState({ camera: '', scan: '' })
  const [msg, setMsg] = useState({ msg: '', type: '' })
  const [parData, setParData] = useState({})
  const [qrAdmin, setQrAdmin] = useState({})
  const [loading, setLoading] = useState({ search: false })
  const [searchText, setSearchText] = useState('')
  const [searchData, setSearchData] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()
  const { appSetting } = GlobalContextConsumer()
  const [manualMode, setManualMode] = useState(false)
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })
  const [startCam, setStartCam] = useState(false)
  const [adminModal, setAdminModal] = useState(false)
  const [facingMode, setFacingMode] = useState('environment')

  useEffect(() => {
    axios
      .get(reqs.QR_USER, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) {
          setQrAdmin(res.data.result)
        } else {
          navigate('/qrLogin', { replace: true })
        }
      })
      .catch((err) => {
        navigate('/qrLogin', { replace: true })
      })
  }, [])

  const logOutQR = () => {
    axios
      .post(reqs.QR_LOGOUT, {}, { withCredentials: true })
      .then((res) => {
        if (res.data.succeed) navigate('/qrLogin', { replace: true })
      })
      .catch((error) => {
        alert(error.response.data.msg)
      })
  }

  const updateEventInfo = (updateType, qrCode) => {
    axios
      .post(
        `${reqs.UPDATE_SCANNED_EVENT}${qrCode}`,
        { updateType: updateType },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setParData((parData) => {
            return {
              ...parData,
              events: {
                ...parData.events,
                [`${qrAdmin.event}`]: updateType ? 1 : 0,
              },
            }
          })
          setAlertMsg({ msg: res.data.msg, severity: 'success' })
        } else {
          setAlertMsg({ msg: res.data.msg, severity: 'error' })
        }
      })
      .catch((error) => {
        setAlertMsg({ msg: error.response.data.msg, severity: 'error' })
      })
  }

  const scan = (code, manualMode) => {
    if (code) {
      axios
        .post(`${reqs.QR_SCAN_INFO}${code}`, {}, { withCredentials: true })
        .then((res) => {
          setParData(res.data.result)
          if (res.data.succeed) {
            setMsg({ msg: res.data.msg, type: 'success' })
            if (
              manualMode === false ||
              manualMode === undefined ||
              manualMode === null
            )
              updateEventInfo(true, code)
          } else setMsg({ msg: res.data.msg, type: 'error' })
        })
        .catch((error) => {
          setMsg({ msg: '', type: '' })
          setErr({ ...err, scan: error.response.data.msg })
          setParData({})
        })
    }
  }

  const handleSearchChange = (e) => {
    const curValue = e.target.value
    if (curValue.length < 1) {
      setSuggestions([])
    } else if (searchText.length < 1 && curValue.length === 1) {
      setLoading({ ...loading, search: true })
      axios
        .get(`${reqs.QR_SEARCH_TEXT}${curValue}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.succeed) {
            setSearchData(res.data.result)
            setSuggestions(res.data.result)
          }
          setLoading({ ...loading, search: false })
        })
        .catch((error) => {
          setErr({ ...err, scan: error.response.data.msg })
          setLoading({ ...loading, search: false })
        })
    } else {
      setSuggestions(
        searchData.filter((data) =>
          data.fullName.toLowerCase().startsWith(curValue.toLowerCase())
        )
      )
    }
    setSearchText(curValue)
  }

  const handleSearch = (code) => {
    if (!suggestions[0]) {
      setAlertMsg({ msg: 'did not match any record', severity: 'error' })
      return
    }
    setManualMode(true)
    const searchedCode = code
      ? code
      : suggestions[0].qrCode || suggestions[0].code
    setCode(searchedCode)
    scan(searchedCode, manualMode || true)
    setSuggestions([])
  }

  const handleScan = (code) => {
    beep.play()
    if (code.length < 100 && typeof code === 'string') {
      manualMode && setManualMode(false)
      setCode(code)
      scan(code, false)
    } else {
      setErr({ camera: 'invalid code', scan: '' })
    }
  }

  if (!qrAdmin.id) return <div>Loading</div>
  return (
    <Container maxWidth='md'>
      {alertMsg.msg && (
        <AlertModal
          openMode={true}
          text={alertMsg.msg}
          timeMs={2000}
          severity={alertMsg.severity}
          setAlertMsg={setAlertMsg}
        />
      )}
      <Box p={1}>
        <Stack flexDirection={'row'} justifyContent='space-between'>
          <Box>
            {type === 'scan' ? (
              <IconButton aria-label='search' onClick={() => setType('search')}>
                <ManageSearchIcon />
              </IconButton>
            ) : (
              <IconButton aria-label='scan' onClick={() => setType('scan')}>
                <QrCodeScannerIcon />
              </IconButton>
            )}
          </Box>
          <Box>
            {startCam && (
              <IconButton aria-label='stop' onClick={() => setStartCam(false)}>
                <NoPhotographyIcon />
              </IconButton>
            )}
            <IconButton
              aria-label='setting'
              onClickCapture={() => setAdminModal(true)}
            >
              <AdminPanelSettingsIcon />
            </IconButton>
            <IconButton aria-label='log out' onClick={() => logOutQR()}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Stack>
      </Box>
      <Box sx={{ margin: '20px auto', maxWidth: '300px', width: '100%' }}>
        {type === 'scan' ? (
          <Box
            sx={{
              border: (theme) => `1px dotted ${theme.palette.darkBlue.main}`,
              margin: '0 auto',
              height: '250px',
              width: '250px',
              cursor: 'pointer',
            }}
            onClick={() => setStartCam(true)}
          >
            {startCam ? (
              <QrReader
                onResult={(result, error) => {
                  if (!!result) {
                    handleScan(result?.text)
                  }

                  if (!!error) {
                    setErr({ ...err, camera: error.message })
                  }
                }}
                style={{ width: '100%' }}
                constraints={{ facingMode: facingMode }}
              />
            ) : (
              <Typography align={'center'} fontSize='13px' fontWeight={'500'}>
                click to start the camera
              </Typography>
            )}
            <Typography
              mt={0.3}
              align='center'
              fontSize={'12px'}
              color={'error'}
            >
              {err.camera}
            </Typography>
          </Box>
        ) : (
          <>
            {appSetting.searchPermit ? (
              <SearchBox
                placeholder={'search name'}
                value={searchText}
                handleSearchChange={handleSearchChange}
                handleSearch={handleSearch}
              >
                {loading.search && (
                  <Typography
                    fontWeight={'bold'}
                    align='center'
                    color={'warning.dark'}
                  >
                    searching...
                  </Typography>
                )}
                {suggestions.length > 0 && (
                  <Stack
                    sx={{
                      bgcolor: 'primary.light',
                      borderRadius: '0 0 10px 10px',
                      maxHeight: '350px',
                      overflow: 'auto',
                      pt: 0.5,
                    }}
                  >
                    {suggestions.map((par, key) => {
                      return (
                        <Box
                          sx={{
                            padding: '0 0 5px 15px',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'primary.main',
                            },
                            '&:not(:first-of-type)': {
                              mt: 1,
                            },
                            userSelect: 'none',
                          }}
                          onClick={() => handleSearch(par.qrCode || par.code)}
                          key={key}
                          width='100%'
                        >
                          <Stack
                            flexDirection={'column'}
                            color='semiWhite.light'
                          >
                            <Typography
                              variant='subtitle2'
                              color={'semiWhite.main'}
                            >
                              {par.fullName}
                              {par.code && (
                                <Typography
                                  component={'span'}
                                  fontSize='inherit'
                                  color={'info.main'}
                                >
                                  {' - '}
                                  (ca)
                                </Typography>
                              )}
                            </Typography>
                            <Typography variant='body2' fontSize='11px'>
                              {par.institute}
                            </Typography>
                            <Typography
                              variant='body2'
                              color={'info.main'}
                              letterSpacing='1px'
                              fontSize='12px'
                              sx={{ opacity: 0.8 }}
                            >
                              {par.qrCode || par.code}
                            </Typography>
                          </Stack>
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </SearchBox>
            ) : (
              <Typography
                align='center'
                color={'error.dark'}
                fontWeight='500'
                fontSize={'13px'}
              >
                search permit is currently turned off. please ask the admin for
                permission
              </Typography>
            )}
          </>
        )}
      </Box>
      <Box>
        <Typography
          variant='subtitle1'
          letterSpacing={'1px'}
          mt={type === 'search' ? '60px' : '10px'}
          color={'warning.main'}
          align='center'
        >
          <Typography
            component={'span'}
            sx={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: msg.type === 'success' ? 'green' : 'error.main',
            }}
          >
            {err.scan || msg.msg}
          </Typography>
          <br />
          <strong>{code && `(${code})`} </strong>
        </Typography>
        <PerInfo
          scanInfo={parData}
          curEvent={qrAdmin.event}
          upDateInfo={updateEventInfo}
          code={code}
          manualMode={manualMode}
        />
      </Box>

      {/* admin modal */}
      {adminModal && (
        <CustomModal open={adminModal} setOpen={setAdminModal}>
          <Stack mt={1} justifyContent={'center'} alignItems={'center'}>
            <Avatar sx={{ bgcolor: 'darkBlue.main' }}>
              {qrAdmin.userName && qrAdmin.userName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography fontWeight={500} color='secondary.main' mt={1}>
              {qrAdmin.userName}
            </Typography>
          </Stack>
          <Stack
            p={3}
            mb={2}
            sx={{
              justifyContent: { xs: 'center', xsm: 'space-between' },
              columnGap: 2,
            }}
            flexDirection={'row'}
            alignItems={'center'}
            flexWrap='wrap'
            rowGap={3}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={manualMode}
                  onChange={() => setManualMode(!manualMode)}
                />
              }
              label={`manual mode`}
            />
            <FormControl sx={{ width: '150px' }}>
              <SelectOptions
                ops={{
                  value: facingMode,
                  options: [
                    { name: 'front', value: 'user' },
                    { name: 'back', value: 'environment' },
                    { name: 'left', value: 'left' },
                    { name: 'right', value: 'right' },
                  ],
                  label: 'camera mode',
                  handleOptionChange: (e) => setFacingMode(e.target.value),
                }}
              />
            </FormControl>
          </Stack>
          <Stack
            justifyContent={'space-between'}
            flexDirection={'column'}
            alignItems='center'
            mb={2}
          >
            <a href='https://nditc.org/index.php' target='_blank'>
              <img src='Images/nditcT.png' alt='nditc logo' width='180px' />
            </a>
            <Typography
              color={'primary.main'}
              sx={{ opacity: '.7' }}
              mt={2}
              fontSize={'.8rem'}
              align='center'
            >
              © copyright {new Date().getFullYear()} NDITC || developed by{' '}
              <StyledLink target='_blank' href='https://www.khalidAhammed.com'>
                Khalid Ahammed Uzzal
              </StyledLink>
            </Typography>
          </Stack>
        </CustomModal>
      )}
    </Container>
  )
}

export default Scanner
