import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import styled from '@emotion/styled'
import { Box } from '@mui/system'

export const SelectOptions = ({ ops }) => {
  const { value, defValue, options, label, handleOptionChange } = ops

  return (
    <>
      <InputLabel id='mode-select'>{label}</InputLabel>
      <Select
        autoWidth
        labelId='mode-select'
        id='mode-select'
        value={value}
        label={'label'}
        onChange={handleOptionChange}
        defaultValue={defValue}
        sx={{ height: '30px', fontSize: '.9rem' }}
      >
        {options.map((option, key) => {
          return (
            <MenuItem key={key} value={option.value}>
              {option.name}
            </MenuItem>
          )
        })}
      </Select>
    </>
  )
}

const inputStyle = { marginBottom: '15px' }

export const InputField = ({
  errMsg,
  label,
  name,
  value,
  onChange,
  required,
  fullWidth,
  placeholder,
}) => {
  return (
    <TextField
      required={required == true || required == false ? required : true}
      fullWidth={fullWidth ? fullWidth : true}
      style={inputStyle}
      error={errMsg ? true : false}
      label={label}
      name={name}
      variant='outlined'
      value={value}
      onChange={onChange}
      helperText={errMsg}
      color={errMsg ? 'error' : 'primary'}
      placeholder={placeholder || ''}
    />
  )
}

export const InputTextField = ({
  errMsg,
  label,
  name,
  value,
  onChange,
  rows,
  required,
  fullWidth,
  placeholder,
}) => {
  return (
    <TextField
      fullWidth={fullWidth ? fullWidth : true}
      required={required == true || required == false ? required : true}
      multiline
      style={inputStyle}
      error={errMsg ? true : false}
      label={label}
      name={name}
      variant='outlined'
      value={value}
      onChange={onChange}
      helperText={errMsg}
      color={errMsg ? 'error' : 'primary'}
      // maxRows={rows}
      placeholder={placeholder || ''}
    />
  )
}

const Input = styled('input')({
  display: 'none',
})
export const ImgField = ({ label, name, onChange }) => {
  return (
    <Box>
      <Typography variant='subtitle2' component={'span'}>
        {label}
      </Typography>
      <label htmlFor={name}>
        <Input
          accept='image/*'
          id={name}
          name={name}
          onChange={onChange}
          type='file'
        />
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='span'
        >
          <PhotoCamera />
        </IconButton>
      </label>
    </Box>
  )
}
