import { FormControlLabel, Switch } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import reqs from '../../../data/requests'
import { SmallInfoButton } from '../../../global_components/Buttons'

const CABlockState = ({
  userName,
  disableState,
  blocked,
  setAlertMsg,
  handleBlockState,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          color={!blocked ? 'success' : 'error'}
          checked={!blocked}
          onChange={() => handleBlockState(userName, !blocked)}
          name='on'
          disabled={disableState}
        />
      }
      label=''
    />
  )
}

export default CABlockState
