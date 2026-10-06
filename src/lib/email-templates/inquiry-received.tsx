import * as React from 'react'

import { translate, type Locale } from '@/i18n/config'
import { NoirEmail, P } from './layout'
import type { TemplateEntry } from './registry'

interface Props {
  siteName?: string
  locale?: string
  name?: string
  subject?: string
}

const loc = (l?: string): Locale => (l === 'de' ? 'de' : 'en')

/** Sent to the person who wrote in: we have it, here is what happens next. */
const InquiryReceivedEmail = ({ siteName = 'Website', locale, name, subject }: Props) => {
  const l = loc(locale)
  return (
    <NoirEmail
      lang={l}
      siteName={siteName}
      preview={translate(l, 'emails.received.preview')}
      heading={name ? translate(l, 'emails.received.greeting', { name }) : translate(l, 'emails.received.greeting_plain')}
      footnote={translate(l, 'emails.received.footnote')}
    >
      <P>{translate(l, 'emails.received.body', { site: siteName })}</P>
      {subject ? <P>{translate(l, 'emails.received.about', { subject })}</P> : null}
      <P>{translate(l, 'emails.received.next')}</P>
    </NoirEmail>
  )
}

export const template = {
  component: InquiryReceivedEmail,
  subject: (d: Record<string, unknown>) =>
    translate(loc(d['locale'] as string | undefined), 'emails.received.subject'),
  displayName: 'Enquiry received (to sender)',
  previewData: { siteName: 'Studio', locale: 'en', name: 'Jane', subject: 'Apartment, 3 rooms' },
} satisfies TemplateEntry
