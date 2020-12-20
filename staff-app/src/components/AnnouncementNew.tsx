import * as React from 'react'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import { StoreContext } from '../models/reactUtils'

export default function AnnouncementNew({ done }: { done: () => void }) {
  const store = React.useContext(StoreContext)
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')

  return (
    <>
      <div>
        <TextField
          id="subject"
          label="subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="body"
          label="body"
          value={body}
          multiline
          onChange={e => setBody(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="imageUrl"
          label="imageUrl"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />
      </div>
      <IconButton
        onClick={() => {
          store.createNewAnnouncement({ subject, body, imageUrl })
          done()
        }}
      >
        <SaveIcon />
      </IconButton>
      <IconButton onClick={() => done()}>
        <DeleteIcon />
      </IconButton>
    </>
  )
}
