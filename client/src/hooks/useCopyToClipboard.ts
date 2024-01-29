import { useCallback, useState } from 'react'
import { ToastifyRoot } from '@/features'

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean>

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      ToastifyRoot.success('Copied to clipboard.')
      return true
    } catch (error) {
      setCopiedText(null)
      ToastifyRoot.error('Copy failed')
      return false
    }
  }, [])

  return [copiedText, copy]
}
