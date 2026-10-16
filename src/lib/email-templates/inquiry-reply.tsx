import * as React from 'react'
import { Body, Container, Head, Html, Link, Preview, Section, Text } from '@react-email/components'

import { translate, type Locale } from '@/i18n/config'
import type { TemplateEntry } from './registry'

// A personal one-to-one reply: plain letter look, no banner or heading.
// Signature values come from site_settings, passed in by the sender.
export interface ReplySignature {
  person?: string
  company?: string
  phone?: string
  email?: string
  address?: string
  website?: string
}

interface Props {
  siteName?: string
  locale?: string
  name?: string
  body?: string
  original?: string
  originalDate?: string
  signature?: ReplySignature
}

const loc = (l?: string): Locale => (l === 'de' ? 'de' : 'en')

const InquiryReplyEmail = ({ siteName = 'Website', locale, name, body = '', original, originalDate, signature = {} }: Props) => {
  const l = loc(locale)
  const sig = signature
  const company = sig.company && sig.company !== sig.person ? sig.company : undefined
  const website = sig.website?.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <Html lang={l} dir="ltr">
      <Head />
      <Preview>{body.slice(0, 120)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>{name ? translate(l, 'emails.reply.greeting', { name }) : translate(l, 'emails.reply.greeting_plain')}</Text>
          <Text style={text}>{body}</Text>
          <Text style={{ ...text, margin: '24px 0 4px' }}>{translate(l, 'emails.reply.sign_off')}</Text>
          <Text style={{ ...text, margin: '0 0 20px' }}>{sig.person || siteName}</Text>
          <Section style={sigBox}>
            {company ? <Text style={sigStrong}>{company}</Text> : null}
            {sig.phone ? (
              <Text style={sigLine}>
                {translate(l, 'emails.reply.phone')}: <Link style={link} href={`tel:${sig.phone.replace(/[^+\d]/g, '')}`}>{sig.phone}</Link>
              </Text>
            ) : null}
            {sig.email ? (
              <Text style={sigLine}>
                {translate(l, 'emails.reply.email')}: <Link style={link} href={`mailto:${sig.email}`}>{sig.email}</Link>
              </Text>
            ) : null}
            {sig.address ? <Text style={sigLine}>{sig.address}</Text> : null}
            {sig.website && website ? (
              <Text style={sigLine}>
                <Link style={link} href={sig.website}>{website}</Link>
              </Text>
            ) : null}
          </Section>
          {original ? (
            <Section style={{ marginTop: '28px' }}>
              <Text style={quoteIntro}>
                {name ? translate(l, 'emails.reply.quote_intro', { date: originalDate ?? '', name }) : translate(l, 'emails.reply.quote_intro_plain', { date: originalDate ?? '' })}
              </Text>
              <Text style={quote}>{original}</Text>
            </Section>
          ) : null}
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: InquiryReplyEmail,
  subject: (d: Record<string, unknown>) =>
    translate(loc(d['locale'] as string | undefined), 'emails.reply.subject', {
      site: (d['siteName'] as string) ?? '',
    }),
  displayName: 'Reply to enquiry',
  previewData: {
    siteName: 'Studio',
    locale: 'en',
    name: 'Jane',
    body: 'Thank you for your interest…',
    original: 'Is the flat still available?',
    originalDate: '1 January 2026',
    signature: { person: 'Agent Name', company: 'Studio', phone: '+00 000 000', email: 'hello@example.com', website: 'https://example.com' },
  },
} satisfies TemplateEntry

// Mail clients ignore CSS variables, so literal values live here only.
const INK = '#1A1A1A'
const MUTED = '#666666'
const FONT = "-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const main = { backgroundColor: '#ffffff', fontFamily: FONT, color: INK }
const container = { padding: '8px 4px', maxWidth: '600px', margin: '0' }
const text = { fontSize: '15px', lineHeight: '1.6', color: INK, margin: '0 0 16px', whiteSpace: 'pre-wrap' as const }
const sigBox = { borderTop: '1px solid #E5E5E5', paddingTop: '12px' }
const sigStrong = { fontSize: '13px', lineHeight: '1.5', fontWeight: 700, color: INK, margin: '0' }
const sigLine = { fontSize: '13px', lineHeight: '1.5', color: MUTED, margin: '0' }
const link = { color: INK, textDecoration: 'none' }
const quoteIntro = { fontSize: '13px', color: MUTED, margin: '0 0 6px' }
const quote = { fontSize: '13px', lineHeight: '1.5', color: MUTED, margin: '0', paddingLeft: '12px', borderLeft: '2px solid #E5E5E5', whiteSpace: 'pre-wrap' as const }
