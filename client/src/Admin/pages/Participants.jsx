import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  FormControl,
  List,
  ListItem,
  FormControlLabel,
  Switch,
  Typography,
  Link as MuiLink,
} from '@mui/material'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import reqs from '../../data/requests'
import { GlobalContextConsumer } from '../../GlobalContext'
import { InfoTypography } from '../../global_components/Typographies'
import { FooterFixedBox } from '../components/ParAndCAInfo/FooterInfos'
import {
  AvatarImgName,
  EventButton,
  PayButton,
} from '../components/ParAndCAInfo/NameInfoCell'
import { SelectOptions } from '../../global_components/FormControls'
import { EditModeModal } from '../components/ParAndCAInfo/EditModals'
import { AlertModal } from '../../global_components/Alerts'
import { Box } from '@mui/system'
import SearchBox from '../components/ParAndCAInfo/SearchBox'
import { eventsInfoIterate } from '../components/ParAndCAInfo/TableFuncs'
import { EmailOutlined, Facebook, Phone } from '@mui/icons-material'
import styled from '@emotion/styled'

const StyledCell = styled(TableCell)({
  fontSize: '12px',
})

const Participants = () => {
  const [searchParams] = useSearchParams()
  const [dataCount, setDataCount] = useState(0)
  const category = searchParams.get('category')
  const [rows, setRows] = useState(50)
  const [data, setData] = useState([])
  const [pages, setPages] = useState(1)
  const [pgNo, setPgNo] = useState(1)
  const [mode, setMode] = useState(
    !category || category === 'all' ? 'allPar' : category
  )
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })
  const { events } = GlobalContextConsumer()
  const [qrCheckMode, setQrCheckedMode] = useState(false)
  const [scanned, setScanned] = useState(0)

  const handleScanned = (data, mode) => {
    let scannedData = 0
    data.forEach((item) => {
      let eventObj = JSON.parse(item.eventInfo)
      if (mode === 'allPar') {
        for (let key in eventObj) {
          if (eventObj[key] === 1) scannedData = scannedData + 1
        }
      } else if (mode) {
        if (eventObj[mode] === 1) scannedData = scannedData + 1
      }
    })
    setScanned(scannedData)
  }

  useEffect(() => {
    axios
      .get(
        reqs.ALL_COUNT_ONEVENT + `${!mode || mode === 'allPar' ? 'all' : mode}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.succeed) {
          let count = res.data.result
          if (Number(count) < 1) {
            setDataCount(0)
            throw new Error('No data')
          }
          setDataCount(count)
          setPages(Math.ceil(count / rows))
          const skip = pgNo * rows - rows

          return axios.post(
            reqs.ALL_CLIENTS_ONEVENT + mode,
            {
              skip: skip,
              rowNum: rows,
            },
            { withCredentials: true }
          )
        }
      })
      .then((res) => {
        if (res.data.succeed) {
          setData(res.data.result)
          handleScanned(res.data.result, mode)
        }
      })
      .catch((err) => {
        if (err.message === 'No data') {
          setData([])
          setAlertMsg({ msg: err.message, severity: 'error' })
        } else {
          setAlertMsg({
            msg: err.response?.data?.msg || 'Unable to load participants.',
            severity: 'error',
          })
        }
      })
  }, [pgNo, mode, rows])

  const handleChangePage = (event, value) => {
    setPgNo(value)
  }

  const handleChangeRowsPerPage = (event) => {
    setRows(+event.target.value)
    setPgNo(1)
  }

  const stringFilter = (string) => {
    return string.split(',').filter((item) => item !== '')
  }

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      {alertMsg.msg && (
        <AlertModal
          openMode={true}
          text={alertMsg.msg}
          timeMs={800}
          severity={alertMsg.severity}
          setAlertMsg={setAlertMsg}
        />
      )}

      <Stack mb={2} spacing={0.5}>
        <Typography variant='h4' color='secondary.main' fontWeight={700}>
          Participants
        </Typography>
        <Typography color='text.secondary'>
          Review registration, attendance, team, payment, and submission data.
        </Typography>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          maxHeight: 'calc(100vh - 225px)',
          overflow: 'auto',
          borderRadius: 2,
          boxShadow: '0 8px 28px rgba(20, 24, 38, .10)',
        }}
      >
        <Table
          stickyHeader
          size='small'
          aria-label='Participant operations table'
          sx={{ minWidth: '1320px' }}
        >
          <TableHead
            sx={{
              '& th': {
                backgroundColor: 'primary.main',
                color: 'semiWhite.main',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              },
            }}
          >
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Participant</TableCell>
              <TableCell>QR / Class</TableCell>
              <TableCell>Institution</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Events</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Submissions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((par, value) => {
              let paidEvent = JSON.parse(par.paidEvent)

              let submissionObj = {
                subLinks: par.SubLinks
                  ? eventsInfoIterate(JSON.parse(par.SubLinks))
                  : [],
                subNames: par.SubLinks
                  ? eventsInfoIterate(JSON.parse(par.SubNames))
                  : [],
              }

              return (
                <TableRow
                  key={value}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '& td': { verticalAlign: 'top', py: 1.5 },
                  }}
                >
                  <StyledCell component='th' scope='row'>
                    {par.id}
                  </StyledCell>
                  <StyledCell sx={{ minWidth: '200px' }}>
                    <AvatarImgName
                      image={par.image}
                      fullName={par.fullName}
                      userName={par.userName}
                    />
                  </StyledCell>
                  <StyledCell sx={{ minWidth: '125px' }}>
                    <Typography fontSize='12px' fontWeight={700}>
                      {par.qrCode}
                    </Typography>
                    <Typography fontSize='12px' color='text.secondary'>
                      {par.className}
                    </Typography>
                  </StyledCell>
                  <StyledCell sx={{ minWidth: '160px' }}>
                    <Typography fontSize='12px' fontWeight={700}>
                      {par.institute}
                    </Typography>
                    <Typography fontSize='12px' color='text.secondary'>
                      {par.roll_no ? `Roll ${par.roll_no}` : 'Roll not set'}
                    </Typography>
                    <Typography fontSize='11px' color='text.secondary'>
                      {par.address}
                    </Typography>
                  </StyledCell>
                  <StyledCell sx={{ minWidth: '190px' }}>
                    <Typography
                      fontSize='12px'
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {par.email}
                    </Typography>
                    <Typography fontSize='12px'>{par.phone}</Typography>
                    <Stack flexDirection='row' columnGap={1} mt={0.5}>
                      <Link
                        to={`/admin/messages?email=${par.email}&name=${par.fullName}&phone=${par.phone}`}
                        style={{ color: 'brown' }}
                        aria-label={`Message ${par.fullName}`}
                      >
                        <EmailOutlined fontSize='small' />
                      </Link>
                      <a
                        target='_blank'
                        rel='noreferrer'
                        href={par.fb}
                        aria-label={`${par.fullName} on Facebook`}
                      >
                        <Facebook color='secondary' fontSize='small' />
                      </a>
                      <Link
                        to={`/admin/messages?email=${par.email}&name=${par.fullName}&phone=${par.phone}`}
                        aria-label={`Call ${par.fullName}`}
                      >
                        <Phone color='success' fontSize='small' />
                      </Link>
                    </Stack>
                  </StyledCell>
                  <StyledCell>
                    {eventsInfoIterate(JSON.parse(par.eventInfo)).map(
                      (event, value) => {
                        return (
                          <EventButton
                            key={value}
                            event={event}
                            mode={mode}
                            id={par.qrCode}
                            setAlertMsg={setAlertMsg}
                            disableMode={!qrCheckMode}
                          />
                        )
                      }
                    )}
                  </StyledCell>
                  <StyledCell>
                    <List>
                      {eventsInfoIterate(JSON.parse(par.teamName)).map(
                        (team, value) => {
                          return (
                            <ListItem
                              disablePadding
                              key={value}
                              sx={{
                                fontSize: '12px',
                              }}
                            >
                              <InfoTypography
                                label={team.eventName}
                                info={team.value}
                              />
                            </ListItem>
                          )
                        }
                      )}
                    </List>
                  </StyledCell>
                  <StyledCell>
                    <List>
                      {eventsInfoIterate(JSON.parse(par.transactionID)).map(
                        (pay, value) => {
                          return (
                            <ListItem
                              disablePadding
                              key={value}
                              sx={{
                                fontSize: '12px',
                              }}
                            >
                              <Stack>
                                <Typography
                                  component={'span'}
                                  variant={'subtitle2'}
                                  fontSize='12px'
                                >
                                  {pay.eventName} :
                                </Typography>
                                <PayButton
                                  key={value}
                                  pay={{
                                    eventName: pay.eventName,
                                    value: pay.value,
                                    checked: paidEvent[`${pay.eventName}`],
                                  }}
                                  mode={mode}
                                  id={par.id}
                                  setAlertMsg={setAlertMsg}
                                  disableMode={!qrCheckMode}
                                />
                              </Stack>
                            </ListItem>
                          )
                        }
                      )}
                    </List>
                  </StyledCell>
                  <StyledCell>
                    {submissionObj.subLinks.map((link, key) => {
                      return (
                        <ListItem
                          disablePadding
                          key={key}
                          sx={{
                            fontSize: '12px',
                          }}
                        >
                          <InfoTypography
                            label={link.eventName}
                            info={stringFilter(link.value).map((item, key) => (
                              <MuiLink
                                key={key}
                                target={'_blank'}
                                href={item}
                                sx={{
                                  textDecoration: 'none',
                                  fontSize: '.7rem',
                                  color: 'info.light',
                                  lineHeight: '1px',
                                }}
                              >
                                {item.slice(0, 10)}
                                {' , '}
                              </MuiLink>
                            ))}
                          />
                        </ListItem>
                      )
                    })}
                  </StyledCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* table controls */}
      <FooterFixedBox>
        <Stack
          sx={{
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto',
            justifyContent: { xs: 'center', sm: 'space-between' },
            flexDirection: { xs: 'column', sm: 'row' },
            rowGap: { xs: '10px', sm: 0 },
          }}
          spacing={1}
          flexWrap={'wrap'}
          p={1}
        >
          <SearchBox />
          {pages > 1 ? (
            <Pagination
              count={pages}
              page={pgNo}
              onChange={handleChangePage}
              shape='rounded'
              color='primary'
              sx={{
                marginBottom: {
                  xs: '15px',
                  sm: 0,
                },
              }}
            />
          ) : (
            ''
          )}
          <Box>
            <FormControl>
              <SelectOptions
                ops={{
                  value: mode,
                  defValue: mode,
                  options: [...events, { name: 'All', value: 'allPar' }],
                  label: 'Mode',
                  handleOptionChange: (e) => {
                    setMode(e.target.value)
                  },
                }}
              />
            </FormControl>
            <FormControl sx={{ ml: 3 }}>
              <SelectOptions
                ops={{
                  value: rows,
                  defValue: 50,
                  options: [
                    { name: 20, value: 20 },
                    { name: 50, value: 50 },
                    { name: 100, value: 100 },
                    { name: 'All', value: data.length },
                  ],
                  label: 'Rows per page',
                  handleOptionChange: handleChangeRowsPerPage,
                }}
              />
            </FormControl>
          </Box>
        </Stack>

        <Stack
          sx={{
            justifyContent: { xs: 'center', sm: 'space-between' },
            flexDirection: { xs: 'column', sm: 'row' },
            rowGap: { xs: '10px', sm: 0 },
          }}
          columnGap={5}
          flexWrap={'wrap'}
        >
          <Stack
            justifyContent={'center'}
            flexDirection={'row'}
            flex={1}
            columnGap={2}
            sm={4}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={qrCheckMode}
                  onChange={() => {
                    setQrCheckedMode(!qrCheckMode)
                  }}
                  name='on'
                />
              }
              label='Edit Mode'
            />
            <EditModeModal
              openMode={qrCheckMode}
              text='Enable edit mode? Changes made in this mode take effect immediately.'
            />
          </Stack>

          <Stack
            justifyContent={'center'}
            flexDirection={'row'}
            columnGap={5}
            flexWrap={'wrap'}
            pb={1}
            pt={1}
            flex={1}
          >
            <InfoTypography
              label={mode === 'allPar' ? 'All' : mode}
              info={dataCount}
            />
            <InfoTypography label='Scanned' info={scanned} />
          </Stack>
        </Stack>
      </FooterFixedBox>
    </Container>
  )
}

export default Participants
