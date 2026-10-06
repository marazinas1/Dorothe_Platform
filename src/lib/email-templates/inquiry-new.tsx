import * as React from 'react'

import { translate, type Locale } from '@/i18n/config'
import { Facts, NoirEmail, P } from './layout'
import type { TemplateEntry } from './registry'

interface Props {
  siteName?: string
  locale?: string
  type?: string
  name?: string
  email?: string
  phone?: string
  message?: string
  subject?: string
  adminUrl?: string
}

const loc = (l?: string): Locale => (l === 'de' ? 'de' : 'en')
const typeKey = (t?: string) => (t === 'listing' || t === 'buyer' || t === 'seller' ? t : 'other')

/** Sent to the broker: a new enquiry is waiting in the admin. */
const InquiryNewEmail = (p: Props) => {
  const l = loc(p.locale)
  const kind = translate(l, `admin.inquiries.types.${typeKey(p.type)}`)
  return (
    <NoirEmail
      lang={l}
      siteName={p.siteName ?? 'Website'}
      preview={`${kind}: ${p.name ?? p.email ?? ''}`}
      heading={translate(l, 'emails.new.heading')}
      cta={p.adminUrl ? { href: p.adminUrl, label: translate(l, 'emails.new.open') } : undefined}
      footnote={translate(l, 'emails.new.footnote')}
    >
      <P>{kind}</P>
      <Facts
        rows={[
          [translate(l, 'emails.new.name'), p.name],
          [translate(l, 'emails.new.email'), p.email],
          [translate(l, 'emails.new.phone'), p.phone],
          [translate(l, 'emails.new.about'), p.subject],
          [translate(l, 'emails.new.message'), p.message],
        ]}
      />
    </NoirEmail>
  )
}

export const template = {
  component: InquiryNewEmail,
  subject: (d: Record<string, unknown>) =>
    translate(loc(d['locale'] as string | undefined), 'emails.new.subject', {
      name: (d['name'] as string | undefined) || (d['email'] as string | undefined) || '',
    }),
  displayName: 'New enquiry (to broker)',
  previewData: {
    siteName: 'Studio', locale: 'en', type: 'seller', name: 'Jane Doe',
    email: 'jane@example.com', message: 'Please value my flat.', adminUrl: 'https://example.com/admin',
  },
} satisfies TemplateEntry
