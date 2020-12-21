import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '../models/reactUtils'
import dayjs from 'dayjs'
import Activity from './Activitiy'
// import Activity from './Activitiy'

function Activities() {
  const { data } = useQuery(store =>
    store.queryGetDayActivities({ date: dayjs().format('YYYY-MM-DD') }, s =>
      s.date.activities(a => a.from.to.location.name.id)
    )
  )
  return (
    <>
      <div>
        {data?.getDayActivities?.date}
        {data?.getDayActivities?.activities?.map(activity => (
          <React.Fragment key={activity.id}>
            <Activity activity={activity} />
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default observer(Activities)
