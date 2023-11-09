import { Box, IconButton, keyframes, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const myEffect = keyframes`
  0% {
    transform: translateX(0%);
  }
    50% {    
    transform: translateX(5%);
  }
  100% {
    transform: translateX(0%);
  }
`

const styles = {
  label: {
    fontFamily: `'Titillium Web', sans-serif`,
    color: 'info.light',
    letterSpacing: '.8px',
    fontSize: '1rem',
    transition: `.5s ease all`,
  },
  input: {
    backgroundColor: 'transparent',
    padding: '5px 10px',
    fontSize: '1rem',
    border: 'none',
    outline: 'none',
    letterSpacing: '1px',
    color: 'semiWhite.light',
    transition: `.5s ease all`,
  },
  labelF: {
    color: 'info.main',
    fontWeight: 'bold',
    transform: 'translateY(0px)',
  },
  inputF: {
    backgroundColor: 'rgba(0,0,0,.05)',
    padding: '5px 10px',
  },
  containerF: {
    borderBottomWidth: '2px',
    borderBottomColor: 'info.main',
    color: 'info.main',
  },
}

export const CustomInField = ({
  customStyle,
  maxWidth,
  type,
  placeholder,
  onChange,
  value,
  label,
  msg,
  errType,
  name,
  required,
  showIcon,
  disabled,
  className,
  focused,
}) => {
  const [showPass, setShowPass] = useState(false)
  let cStyle = customStyle || {}

  return (
    <Box>
      <Stack
        sx={{
          position: 'relative',
          maxWidth: maxWidth || null,

          width: '100%',
          transition: `.5s ease all`,
          borderBottom: (theme) => `1px solid ${theme.palette.info.dark}`,
          '& label': {
            ...styles.label,
            transform: value ? null : 'translateY(3px)',
          },
          '& input': {
            ...styles.input,
            padding: value || focused ? '5px 10px' : '0 10px',
          },
          '& input::placeholder': {
            transition: `.5s ease all`,
            opacity: 0,
            fontSize: '.9rem',
          },
          '&:focus-within label': {
            ...styles.labelF,
            animation: `${myEffect} .5s ease-in-out 1 forwards`,
          },
          '&:focus-within': {
            ...styles.containerF,
          },
          '&:focus-within input': {
            ...styles.inputF,
          },
          '&:focus-within input::placeholder': {
            opacity: 0.8,
          },
          ...cStyle,
        }}
      >
        {label && (
          <label htmlFor={name}>
            {label} {required === false ? '' : '*'}
          </label>
        )}
        <input
          type={!type || showPass === true ? 'text' : type}
          placeholder={placeholder || ''}
          onChange={onChange}
          value={value}
          name={name}
          id={name}
          required={required === false ? false : true}
          disabled={disabled === true ? true : false}
          className={className || null}
        />
        {showIcon === true && (
          <IconButton
            sx={{
              position: 'absolute',
              right: '0',
              bottom: '0',
              color: 'semiWhite.light',
            }}
            onClick={(_) => setShowPass(!showPass)}
          >
            {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        )}
      </Stack>
      {msg && (
        <Typography
          sx={{
            opacity: '.9',
            letterSpacing: '.7px',
            fontSize: '12px',
            color: errType === 'none' ? 'semiWhite.light' : 'warning.main',
          }}
        >
          {msg}
        </Typography>
      )}
    </Box>
  )
}

export const CustomSelectField = ({
  options,
  label,
  onChange,
  name,
  errType,
  msg,
  required,
}) => {
  return (
    <Stack>
      <Stack
        sx={{
          transition: `.5s ease all`,
          borderBottom: (theme) => `1px solid ${theme.palette.info.dark}`,
          '& label': {
            ...styles.label,
          },
          '& input': {
            ...styles.input,
          },
          '&:focus-within label': {
            ...styles.labelF,
            animation: `${myEffect} .5s ease-in-out 1 forwards`,
          },
          '&:focus-within': {
            borderBottomWidth: '2px',
            borderBottomColor: 'info.main',
            color: 'info.main',
          },
          '&:focus-within input': {
            ...styles.inputF,
          },
          '& select': {
            border: 'none',
            outline: 'none',
            color: 'semiWhite.main',
            backgroundColor: 'transparent',
            fontFamily: `'Titillium Web', sans-serif`,
            fontSize: '.9rem',
            letterSpacing: '.8px',
          },
          '& option': {
            letterSpacing: '.8px',
            backgroundColor: 'primary.main',
            fontFamily: `'Titillium Web', sans-serif`,
          },
        }}
      >
        <label htmlFor='select'>
          {label} {required === false ? '' : '*'}
        </label>
        <select name={name} id='select' defaultValue={''} onChange={onChange}>
          <option value=''>select</option>
          {options &&
            options.map((option, key) => {
              return (
                <option key={key} value={option.value}>
                  {option.name}
                </option>
              )
            })}
        </select>
      </Stack>
      {msg && (
        <Typography
          sx={{
            opacity: '.9',
            letterSpacing: '.7px',
            fontSize: '12px',
            color: errType === 'error' ? 'warning.dark' : 'warning.main',
          }}
        >
          {msg}
        </Typography>
      )}
    </Stack>
  )
}
