import Script from 'next/script'

import { isProd } from '@/lib/isProduction'

const Umami = () => {
  if (isProd) {
    return (
      <>
        <Script
          async
          defer
          data-website-id='f9234f5f-8348-47d2-8808-9dce193bb82c'
          src='https://umami.honghong.me/umami.js' // Replace with your umami instance
        />
      </>
    )
  }

  return null
}

export default Umami
