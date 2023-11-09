import { Button } from '@mui/material'
import { handleCompressImg } from '../../../Utils/imgCompressor'

const UploadInput = ({ name, values, setValues, cStyles }) => {
  const styles = cStyles || {}
  return (
    <Button
      component='label'
      sx={{
        borderRadius: 0,
        width: 'max-content',
        margin: '0 auto',
        padding: '0px 5px',
        fontSize: '.7rem',
        textAlign: 'center',
        ...styles,
      }}
      color='info'
      size='small'
      variant='outlined'
    >
      {name || 'Upload'}
      <input
        hidden
        accept='.jpg, .jpeg, .png'
        type='file'
        onChange={async (e) => {
          const compressedImg = await handleCompressImg(
            e.target.files[0],
            0.07,
            800
          )
          setValues((values) => {
            return {
              ...values,
              file: compressedImg,
            }
          })
        }}
      />
    </Button>
  )
}

export default UploadInput
