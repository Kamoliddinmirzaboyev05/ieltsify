import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button, message, notification } from 'antd'

const ReloadPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  React.useEffect(() => {
    if (offlineReady) {
      message.success('Ilova oflayn rejimda ishlashga tayyor!')
    }
  }, [offlineReady])

  React.useEffect(() => {
    if (needRefresh) {
      notification.info({
        message: 'Yangi yangilanish mavjud!',
        description: 'Ilovani eng so\'nggi versiyasiga yangilashni xohlaysizmi?',
        btn: (
          <div className="flex gap-2">
            <Button size="small" onClick={() => close()}>
              Keyinroq
            </Button>
            <Button type="primary" size="small" onClick={() => updateServiceWorker(true)}>
              Yangilash
            </Button>
          </div>
        ),
        duration: 0,
        onClose: close,
      })
    }
  }, [needRefresh])

  return null
}

export default ReloadPrompt
