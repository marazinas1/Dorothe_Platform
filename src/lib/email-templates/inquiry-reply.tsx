import * as React from 'react'

import { translate, type Locale } from '@/i18n/config'
import { NoirEmail, P } from './layout'
import type { TemplateEntry } from './registry'

interface Props {
  siteName?: string
  locale?: string
  name?: string
  body?: string
  original?: string
}

const loc = (l?: string): Locale => (l === 'de' ? 'de' : 'en')

/** The broker's personal answer to one enquiry, with the original quoted. */
const InquiryReplyEmail = ({ siteName = 'Website', locale, name, body = '', original }: Props) => {
  const l = loc(locale)
  return (
    <NoirEmail
      lang={l}
      siteName={siteName}
      preview={body.slice(0, 120)}
      heading={name ? translate(l, 'emails.reply.greeting', { name }) : translate(l, 'emails.reply.greeting_plain')}
      footnote={original ? `${translate(l, 'emails.reply.original')}\n${original}` : undefined}
    >
      <P>{body}</P>
      <P>{translate(l, 'emails.reply.reply_hint')}</P>
    </NoirEmail>
  )
}

export const template = {
  component: InquiryReplyEmail,
  subject: (d: Record<string, unknown>) =>
    translate(loc(d['locale'] as string | undefined), 'emails.reply.subject', {
      site: (d['siteName'] as string) ?? '',
    }),
  displayName: 'Reply to enquiry',
  previewData: { siteName: 'Studio', locale: 'en', name: 'Jane', body: 'Thank you for your interest…', original: 'Is the flat still available?' },
} satisfies TemplateEntry
