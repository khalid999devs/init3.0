import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { CustomInField } from '../../../global_components/CustomFormControls'
import UploadFileIcon from '@mui/icons-material/UploadFile'

const shortName = (name, letterNum) => {
  let modifiedName = name
  if (name.length > letterNum) {
    modifiedName = `...${name.slice(name.length - letterNum, name.length)}`
  }
  return modifiedName
}

const SubmissionInputs = ({
  submissionArr,
  submitObjArr,
  setSubmitObjArr,
  submission,
}) => {
  return (
    <>
      {submissionArr.map((item, i) => {
        if (submission.type === 'link') {
          return (
            <CustomInField
              key={i}
              label={`${item.split('_').join(' ')} link`}
              name={item}
              value={submitObjArr[i].link}
              placeholder={'https://...'}
              type={'url'}
              onChange={(e) => {
                setSubmitObjArr(
                  submitObjArr.map((subItem) => {
                    if (subItem.name === item) subItem.link = e.target.value
                    return subItem
                  })
                )
              }}
            />
          )
        } else {
          return (
            <Box key={i}>
              <Typography
                color={'info.light'}
                sx={{
                  fontFamily: `'Titillium Web', sans-serif`,
                  mb: 0.5,
                  letterSpacing: '.8px',
                }}
              >
                {' '}
                {item} file{' '}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: '10px',
                  placeItems: 'center',
                  borderBottom: (theme) =>
                    `1px solid ${theme.palette.info.light}`,
                  opacity: 0.9,
                  transition: '.5s ease all',
                  '&:focus-within': {
                    borderBottom: (theme) =>
                      `2px solid ${theme.palette.info.main}`,
                    opacity: 1,
                  },
                  // maxWidth: '300px',
                  overflow: 'hidden',
                }}
              >
                <IconButton
                  color='semiWhite'
                  aria-label='upload picture'
                  component='label'
                  sx={{
                    color: 'info.light',
                    pl: 0,
                    backgroundColor: 'primary.main',
                    borderRadius: 0,
                    padding: '3px 10px 3px 10px',
                    boxShadow: '1px 1px 5px 1px rgba(0,0,0,.5)',
                  }}
                >
                  <input
                    hidden
                    accept={(item === 'image' ? 'image/*' : item) || 'image/*'}
                    type='file'
                    onChange={(e) => {
                      setSubmitObjArr(
                        submitObjArr.map((subItem) => {
                          if (subItem.name === item)
                            subItem.file = e.target.files[0]
                          return subItem
                        })
                      )
                    }}
                  />
                  <UploadFileIcon />
                </IconButton>
                <Typography
                  sx={{
                    width: '100%',
                    color: 'semiWhite.light',
                    fontSize: '.9rem',
                  }}
                  align='left'
                >
                  {submitObjArr[i].file && submitObjArr[i].file.name
                    ? shortName(submitObjArr[i].file.name, 20)
                    : 'no file choosen'}
                </Typography>
              </Box>
              {submitObjArr[i].size && (
                <Typography
                  sx={{
                    color: 'semiWhite.light',
                    fontSize: '.7rem',
                    letterSpacing: '.7px',
                  }}
                >
                  must be under {submitObjArr[i].size || '200'} kb
                </Typography>
              )}
            </Box>
          )
        }
      })}
    </>
  )
}

export default SubmissionInputs
