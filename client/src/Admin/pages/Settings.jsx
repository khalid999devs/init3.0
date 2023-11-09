import { useState, createContext, useContext } from 'react'
import { StyledAdminContainer } from '../../customStyles/StyledContainers'
import { Item } from '../../customStyles/PaperStyle'
import { Box, Stack } from '@mui/material'
import styled from '@emotion/styled'
import PageSetting from '../components/Settings/PageSetting'
import Sponsors from '../components/Settings/Sponsors'
import Faq from '../components/Settings/Faq'
import Notices from '../components/Settings/Notices'
import { AlertModal } from '../../global_components/Alerts'
import DownloadFile from '../components/Settings/DownloadFile'

const AdminSettingContext = createContext()

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '50%',
  },
}))

const Settings = () => {
  const [alertMsg, setAlertMsg] = useState({
    msg: '',
    severity: '',
  })

  return (
    <AdminSettingContext.Provider value={{ setAlertMsg }}>
      <StyledAdminContainer>
        {alertMsg.msg && (
          <AlertModal
            openMode={true}
            text={alertMsg.msg}
            timeMs={1000}
            severity={alertMsg.severity}
            setAlertMsg={setAlertMsg}
          />
        )}
        <Stack
          sx={{ width: '100%' }}
          direction={{ xs: 'column', tablet: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          pl={2}
        >
          <StyledBox>
            <Item>
              <PageSetting />
            </Item>
            <Item sx={{ boxShadow: 'none' }}>
              <Notices />
            </Item>
            <Item>
              <DownloadFile />
            </Item>
          </StyledBox>
          <StyledBox>
            <Item sx={{ boxShadow: 'none' }}>
              <Faq />
            </Item>
            <Item>
              <Sponsors />
            </Item>
          </StyledBox>
        </Stack>
      </StyledAdminContainer>
    </AdminSettingContext.Provider>
  )
}

export const AdminSettingContextConsumer = () => {
  return useContext(AdminSettingContext)
}

export default Settings
