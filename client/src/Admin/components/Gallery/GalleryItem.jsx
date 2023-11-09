import Delete from '@mui/icons-material/Delete'
import EditOutlined from '@mui/icons-material/EditOutlined'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material'
import React from 'react'
import { reqImgWrapper } from '../../../data/requests'

const GalleryItem = ({ values, image, setValues, setFormMode, deleteItem }) => {
  const { id, thumbnail, BigImage, rows, cols, order } = image
  return (
    <Card
      sx={{ maxWidth: 280, width: '100%', backgroundColor: 'semiWhite.main' }}
    >
      <CardMedia
        component='img'
        alt='green iguana'
        height='200'
        image={reqImgWrapper(thumbnail)}
        loading='lazy'
      />
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <Typography gutterBottom variant='h6' color='text.secondary'>
          <strong>Rows - </strong> {rows}
        </Typography>
        <Typography variant='h6' color='text.secondary'>
          <strong>Cols - </strong> {cols}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <span>
          <IconButton
            onClick={() => {
              setValues((values) => {
                return {
                  ...values,
                  gallery: reqImgWrapper(BigImage),
                  thumbnail: reqImgWrapper(thumbnail),
                  rows: rows,
                  cols: cols,
                  order: order,
                  id: id,
                }
              })
              setFormMode('edit')
            }}
            aria-label='edit'
            color='primary'
          >
            <EditOutlined color={'darkBlue'} />
          </IconButton>
          <IconButton
            onClick={() => deleteItem(id)}
            aria-label='edit'
            color='primary'
          >
            <Delete color={'error'} />
          </IconButton>
        </span>

        <Typography mr={2} variant='h5' fontWeight={600} color='text.secondary'>
          {order}
        </Typography>
      </CardActions>
    </Card>
  )
}

export default GalleryItem
