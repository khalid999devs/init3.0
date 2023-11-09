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
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useState, useEffect } from 'react'
import reqs from '../../data/requests'
import { InfoTypography } from '../../global_components/Typographies'
import { FooterFixedBox } from '../components/ParAndCAInfo/FooterInfos'
import {
  AvatarImgName,
  EventButton,
} from '../components/ParAndCAInfo/NameInfoCell'
import { SelectOptions } from '../../global_components/FormControls'
import { EditModeModal } from '../components/ParAndCAInfo/EditModals'
import { AlertModal } from '../../global_components/Alerts'
import { Box } from '@mui/system'
import SearchBox from '../components/ParAndCAInfo/SearchBox'
import { eventsInfoIterate } from '../components/ParAndCAInfo/TableFuncs'
import StarIcon from '@mui/icons-material/Star'
import { Link } from 'react-router-dom'
import { EmailOutlined, Facebook, Phone } from '@mui/icons-material'
import CABlockState from '../components/ParAndCAInfo/CABlockState'

const CAs = () => {
  const [dataCount, setDataCount] = useState(0)
  const [rows, setRows] = useState(50)
  const [data, setData] = useState([])
  const [pages, setPages] = useState(1)
  const [pgNo, setPgNo] = useState(1)
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })
  const [qrCheckMode, setQrCheckedMode] = useState(false)
  const mode = 'cas'

  useEffect(() => {
    axios
      .get(reqs.ALL_COUNT_ONEVENT + mode, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.succeed) {
          let count = res.data.result
          if (Number(count) < 1) {
            throw 'No data'
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
        }
      })
      .catch((err) => {
        if (err === 'No data') {
          setAlertMsg({ msg: err, severity: 'error' })
        } else {
          setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
        }
      })
  }, [pgNo, rows])

  const handleChangePage = (event, value) => {
    setPgNo(value)
  }

  const handleChangeRowsPerPage = (event) => {
    setRows(+event.target.value)
    setPgNo(1)
  }

  const handleBlockState = (userName, updatedBlockState) => {
    axios
      .patch(
        `${reqs.BLOCK_CA}`,
        {
          userName: userName,
          blockState: updatedBlockState,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setData((data) => {
            return data.map((ca) => {
              if (ca.userName === userName) {
                ca.blocked = res.data?.blockeState
              }
              return ca
            })
          })
        }
      })
      .catch((err) => {
        setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  const handleUsedCount = (userName, newCount) => {
    axios
      .patch(
        `${reqs.UPDATE_CA_POINT}`,
        {
          userName: userName,
          usedPoint: newCount,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.succeed) {
          setData((data) => {
            return data.map((ca) => {
              if (ca.userName === userName) {
                ca.used = res.data?.newCount
              }
              return ca
            })
          })
        }
      })
      .catch((err) => {
        setAlertMsg({ msg: err.response.data.msg, severity: 'error' })
      })
  }

  return (
    <Container
      maxWidth='xl'
      sx={{
        padding: {
          xs: '0 10px 0 50px',
          xl: 0,
        },
      }}
    >
      {alertMsg.msg && (
        <AlertModal
          openMode={true}
          text={alertMsg.msg}
          timeMs={800}
          severity={alertMsg.severity}
          setAlertMsg={setAlertMsg}
        />
      )}

      <TableContainer
        component={Paper}
        sx={{
          marginBottom: '150px',
          minWidth: (theme) => theme.breakpoints.values.lg,
          width: (theme) => theme.breakpoints.values.xl,
        }}
      >
        <Table size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>QR Code</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Institute</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email & FB</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Events</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((ca, value) => (
              <TableRow
                key={value}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component='th' scope='row'>
                  {value + 1}
                </TableCell>
                <TableCell sx={{ minWidth: '200px' }}>
                  <AvatarImgName
                    image={ca.image}
                    fullName={ca.fullName}
                    userName={ca.userName}
                  />
                </TableCell>
                <TableCell>{ca.code}</TableCell>
                <TableCell>{ca.className}</TableCell>
                <TableCell>{ca.institute}</TableCell>
                <TableCell>{ca.address}</TableCell>
                <TableCell>
                  <Typography>{ca.email}</Typography>
                  <Stack flexDirection={'row'} columnGap={1}>
                    <Link
                      to={`/admin/messages?phone=${ca.phone}&name=${ca.fullName}&email=${ca.email}`}
                      style={{ color: 'brown' }}
                    >
                      <EmailOutlined />
                    </Link>
                    <a target={'_blank'} href={ca.fb}>
                      <Facebook color='secondary' />
                    </a>
                  </Stack>
                </TableCell>
                <TableCell>
                  {ca.phone} <br />{' '}
                  <Link
                    to={`/admin/messages?phone=${ca.phone}&name=${ca.fullName}&email=${ca.email}`}
                  >
                    <Phone color='success' />
                  </Link>
                </TableCell>
                <TableCell>
                  {eventsInfoIterate(JSON.parse(ca.ParEvent.eventInfo)).map(
                    (event, value) => {
                      return (
                        <EventButton
                          key={value}
                          event={event}
                          mode={''}
                          id={ca.code}
                          setAlertMsg={setAlertMsg}
                          disableMode={!qrCheckMode}
                        />
                      )
                    }
                  )}
                </TableCell>

                <TableCell>
                  <Stack
                    sx={{ cursor: 'pointer' }}
                    alignItems={'center'}
                    justifyContent='center'
                    flexDirection={'row'}
                    onClick={() => {
                      const newUsedCount = Number(
                        prompt(
                          `Enter the performance point of ${ca.userName} (must be a number): `,
                          ca.used
                        )
                      )
                      if (newUsedCount && newUsedCount !== ca.used) {
                        handleUsedCount(ca.userName, newUsedCount)
                      }
                    }}
                  >
                    <Typography
                      ml={0.8}
                      component={'span'}
                      variant={'subtitle1'}
                      fontWeight={600}
                    >
                      {ca.used}
                    </Typography>
                    <StarIcon style={{ color: 'goldenrod' }} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <CABlockState
                    userName={ca.userName}
                    blocked={ca.blocked}
                    disableState={!qrCheckMode}
                    setAlertMsg={setAlertMsg}
                    handleBlockState={handleBlockState}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* fixed ops */}
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
              text='Are you sure to enable edit mode? Be careful In this mode. Every click matters'
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
          </Stack>
        </Stack>
      </FooterFixedBox>
    </Container>
  )
}

export default CAs
