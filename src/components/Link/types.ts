import { AnchorProps } from '@mantine/core/lib/Anchor'
import { LinkProps } from 'next/link'

export type TOCLinkProps = {
  id: string
  level: number
  minLevel: number
  text: string
  activeSection: string | null
}

export type CustomLinkProps = {
  noIcon?: boolean
  nextLinkProps?: Omit<LinkProps, 'href'>
} & React.ComponentPropsWithRef<'a'> &
  AnchorProps
