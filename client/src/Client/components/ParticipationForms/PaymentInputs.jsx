import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { bkashMethod, transactionRules } from '../../../data/client'
import { GlobalContextConsumer } from '../../../GlobalContext'
import { CustomInField } from '../../../global_components/CustomFormControls'

const StyledUL = styled('ul')(({ theme }) => ({
  margin: 0,
  paddingLeft: theme.spacing(2),
  fontFamily: `'Titillium Web', sans-serif`,
  '& li': {
    margin: '2px 0',
    color: theme.palette.semiWhite.light,
    paddingLeft: '5px',
    opacity: 0.9,
    letterSpacing: '1px',
    fontSize: '.9rem',
    wordBreak: 'break-word',
  },
  '& li::marker': {
    content: `"➔"`,
    color: theme.palette.info.main,
    fontSize: '.9rem',
    fontWeight: 'bolder',
  },
}))

const PaymentInputs = ({
  values,
  errors,
  setErrors,
  handleInputChange,
  fee,
  inCol,
  email,
}) => {
  const {
    appSetting: { bkash },
  } = GlobalContextConsumer()

  const bkashnumbers = bkash
    ? bkash.split(',').filter((item) => {
        if (item) return item
      })
    : []
  return (
    <>
      <StyledUL>
        <li>
          At first send{' '}
          {fee ? (
            <strong
              style={{ backgroundColor: 'rgba(0,0,0,.3)', padding: '0 3px' }}
            >
              {fee}
            </strong>
          ) : (
            'the fee'
          )}{' '}
          to {bkashnumbers.length > 1 && 'any of these'}{' '}
          <strong
            style={{
              backgroundColor: 'rgba(0,0,0,.3)',
              padding: '0 3px',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigator.clipboard.writeText(bkashnumbers?.join(','))
            }}
          >
            {bkashnumbers.join(' , ')}
          </strong>{' '}
          <Typography
            component={'span'}
            color={'warning.main'}
            fontSize={'.9rem'}
          >
            ({bkashMethod?.service} <b>"{bkashMethod?.type}"</b>)
          </Typography>
        </li>
        <li>
          please use your email ID{' '}
          <strong
            style={{
              cursor: 'pointer',
              backgroundColor: 'rgba(0,0,0,.2)',
              padding: '0 5px',
            }}
            onClick={() => navigator.clipboard.writeText(email)}
          >
            {email || ''}
          </strong>{' '}
          in the reference
        </li>

        {transactionRules.map((rule, key) => {
          return <li key={key}>{rule}</li>
        })}
      </StyledUL>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: inCol ? '1fr' : '1fr 1fr',
          },
          gap: 3,
          columnGap: 5,
        }}
      >
        <CustomInField
          label={'Transaction ID'}
          name={'CtransactionId'}
          value={values.CtransactionId}
          onChange={handleInputChange}
          msg={errors.CtransactionId}
        />
        <CustomInField
          label={'Number'}
          name={'transactionNum'}
          value={values.transactionNum}
          onChange={handleInputChange}
          msg={errors.transactionNum || 'from which the money was sent'}
          errType={'none'}
          placeholder={'01XXXXXXXXX'}
        />
      </Box>
    </>
  )
}

export default PaymentInputs
