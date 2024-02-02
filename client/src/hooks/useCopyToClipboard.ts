import { ToastifyRoot } from '@/features'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean>

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const { t } = useTranslation('useCopy')
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn(t('not_supported'))
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      ToastifyRoot.success(t('success'))
      return true
    } catch (error) {
      setCopiedText(null)
      ToastifyRoot.error(t('error'))
      return false
    }
  }, [])

  return [copiedText, copy]
}
