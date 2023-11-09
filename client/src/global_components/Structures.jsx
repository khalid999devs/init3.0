import {
  Box,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'

export const ListedContact = ({
  items,
  icon,
  spacing,
  direction,
  rowGap,
  fontSize,
  lineHeight,
  children,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: direction || 'row',
        rowGap: rowGap || 'none',
        paddingLeft: { xs: 1, md: 0 },
      }}
    >
      {icon}
      <Stack>
        {items &&
          items.split(',').map((item, key) => {
            return item ? (
              <Typography
                key={key}
                sx={{
                  opacity: '.9',
                  letterSpacing: spacing || 'initial',
                  fontWeight: '400',
                  fontSize: fontSize || '.95rem',
                  lineHeight: lineHeight || '1.35rem',
                  fontFamily: `'Titillium Web', sans-serif`,
                }}
                component={'span'}
              >
                {item}
              </Typography>
            ) : (
              ''
            )
          })}
        {children && children}
      </Stack>
    </Box>
  )
}

export const IconedInfo = ({
  icon,
  text,
  title,
  tiColor,
  teColor,
  textFontSize,
  bgcolor,
  height,
}) => {
  return (
    <Paper
      sx={{
        padding: '5px',
        minWidth: '200px',
        width: 'max-content',
        maxWidth: '200px',
        minHeight: '75px',
        height: 'auto',
        backgroundColor: bgcolor || 'transparent',
        borderRadius: '5px',
        border: !bgcolor
          ? (theme) => `2px solid ${theme.palette.darkBlue.light}`
          : null,
      }}
      elevation={0}
      variant={'outlined'}
    >
      <Stack>
        <Stack columnGap={1} flexDirection={'row'} alignItems={'center'}>
          {icon && icon}
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: tiColor || 'darkBlue.main',
              textTransform: 'capitalize',
              fontWeight: '500',
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography
          align='center'
          fontWeight={'bolder'}
          sx={{
            fontSize: textFontSize || '1.2rem',
            color: teColor || 'error.dark',
          }}
        >
          {text}
        </Typography>
      </Stack>
    </Paper>
  )
}

export const InconedTextField = ({
  value,
  onChange,
  label,
  showPass,
  handleClickButton,
  customStyle,
  variant,
  error,
  helpertext,
  required,
  autofocused,
}) => {
  return (
    <FormControl sx={customStyle} variant={variant || 'filled'}>
      <InputLabel htmlFor='filled-adornment-password'>{label}</InputLabel>
      <FilledInput
        // id='filled-adornment-password'
        type={showPass ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        error={error}
        autoFocus={autofocused || false}
        required={required ? true : false}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickButton}
              edge='end'
            >
              {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      {helpertext && (
        <Typography
          sx={{
            color: error === true ? 'error.main' : 'darkBlue.main',
            fontSize: '.8rem',
            mt: 0.3,
            ml: 1,
          }}
        >
          {helpertext}
        </Typography>
      )}
    </FormControl>
  )
}
