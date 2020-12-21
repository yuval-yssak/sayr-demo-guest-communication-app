import * as React from 'react'
import { ActivityModelType } from '../models'

function Activity({ activity }: { activity: ActivityModelType }) {
  return (
    <>
      <h4>Activity </h4>
      <div>From: {activity.from}</div>
      <div>To: {activity.to}</div>
      <div>Location: {activity.location}</div>
      <div>Name: {activity.name}</div>
    </>
  )
}

export default Activity
