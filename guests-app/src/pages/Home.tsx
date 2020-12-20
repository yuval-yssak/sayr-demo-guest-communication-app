import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../models/reactUtils'
import { RootStoreType } from '../models'
function Home() {
  const store = React.useContext(StoreContext)

  return (
    <>
      <p>Home</p>
      {store.loggedInUser && (
        <button onClick={() => askForNotificationPermission(store)}>
          Register for Notifications
        </button>
      )}
    </>
  )
}

export default observer(Home)

function askForNotificationPermission(store: RootStoreType) {
  Notification.requestPermission(function (result) {
    console.log('User Choice', result)
    if (result !== 'granted') {
      console.log('No notification permission granted!')
    } else {
      configurePushSub(store)
      // displayConfirmNotification();
    }
  })
}

function configurePushSub(store: RootStoreType) {
  if (!('serviceWorker' in navigator)) {
    return
  }
  console.log('halfway to configure push subscription')
  let reg: ServiceWorkerRegistration
  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg
      return swreg.pushManager.getSubscription()
    })
    .then(function (sub) {
      if (sub === null) {
        console.log('creating new subscription')
        // Create a new subscription
        var vapidPublicKey =
          'BFsdpKVL7oSeZspZ8Aa6pyaW1oQbI11bmd_-bpduPnS9_UT8DRhCp3gdTZ_2e9HpFrTfU-lqZuj98Tvvva2-Zdw'
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey)
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        })
      } else {
        console.log('got existing subscription')
        return sub
        // We have a subscription
      }
    })
    .then(async function (newSub) {
      const subscriptionObject: {
        endpoint: string
        // expirationTime: unknown
        keys: {
          p256dh: string
          auth: string
        }
      } = JSON.parse(JSON.stringify(newSub))
      console.log('before mutation')
      const query = await store.mutateCreateUserSubscription({
        authKey: subscriptionObject.keys.auth,
        endpoint: subscriptionObject.endpoint,
        p256DhKey: subscriptionObject.keys.p256dh,
        userAgent: navigator.userAgent,
        userId: store.loggedInUser!.id
      })
      return { ok: true } // ??????
    })
    .then(function (res) {
      if (res.ok) {
        console.log('everything ok, displaying confirmation notification')
        displayConfirmNotification()
      }
    })
    .catch(function (err) {
      console.log(err)
    })
}

function urlBase64ToUint8Array(base64String: string) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  var rawData = window.atob(base64)
  var outputArray = new Uint8Array(rawData.length)

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (swreg) {
      swreg.showNotification('Successfully subscribed!', {
        body: 'You successfully subscribed to our Notification service!',
        // icon: '/src/images/icons/app-icon-96x96.png',
        // image: '/src/images/sf-boat.jpg',
        dir: 'ltr',
        lang: 'en-US', // BCP 47,
        vibrate: [100, 50, 200],
        // badge: '/src/images/icons/app-icon-96x96.png',
        tag: 'confirm-notification',
        renotify: true,
        actions: [
          {
            action: 'confirm',
            title: 'Okay'
            // icon: '/src/images/icons/app-icon-96x96.png'
          },
          {
            action: 'cancel',
            title: 'Cancel'
            // icon: '/src/images/icons/app-icon-96x96.png'
          }
        ]
      })
    })
  }
}
