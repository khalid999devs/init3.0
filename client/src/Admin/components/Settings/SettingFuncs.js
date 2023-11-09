import axios from 'axios'
import reqs from '../../../data/requests'
import { AdminSettingContextConsumer } from '../../pages/Settings'

export const handleDeleteSetting = (id, setSetting) => {
  // const { setAlertMsg } = AdminSettingContextConsumer()

  axios
    .delete(`${reqs.EVENT_SETTING_DELETE}${id}`, { withCredentials: true })
    .then((res) => {
      if (res.data.succeed) {
        // setAlertMsg({ msg: res.data.msg, severity: 'success' })
        setSetting({})
      }
    })
    .catch((error) => {
      // setAlertMsg({ msg: error.response.data.msg, severity: 'error' })
    })
}
