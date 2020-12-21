import * as React from 'react'
import DeviceDetector from 'device-detector-js'
import SmartphoneIcon from '@material-ui/icons/Smartphone'
import TabletIcon from '@material-ui/icons/Tablet'
import TvIcon from '@material-ui/icons/Tv'
import LaptopIcon from '@material-ui/icons/Laptop'
import DevicesOtherIcon from '@material-ui/icons/DevicesOther'
import TableCell from '@material-ui/core/TableCell'

const deviceDetector = new DeviceDetector()

export default function UserDeviceSubscription({
  userAgent
}: {
  userAgent: string
}) {
  const user = deviceDetector.parse(userAgent)
  return (
    <>
      <TableCell component="th" scope="row">
        {user.device?.type === 'smartphone' ? (
          <SmartphoneIcon />
        ) : user.device?.type === 'tablet' ? (
          <TabletIcon />
        ) : user.device?.type === 'television' ? (
          <TvIcon />
        ) : user.device?.type === 'desktop' ? (
          <LaptopIcon />
        ) : (
          <DevicesOtherIcon />
        )}
      </TableCell>
      <TableCell align="right">{user.device?.brand}</TableCell>
      <TableCell align="right">{user.device?.model}</TableCell>
    </>
  )
}
