import * as React from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Text } from '@react-email/components'

// One Noir look for every email. Mail clients ignore CSS variables, so the
// Noir tokens are mirrored here as literal values (this file only).
const INK = '#0A0A0A'
const MUTED = '#5C5C5C'
const LINE = '#E5E5E5'
const FONT = "Urbanist, 'Helvetica Neue', Helvetica, Arial, sans-serif"

interface Props {
  lang?: string
  siteName: string
  preview: string
  heading: string
  children: React.ReactNode
  cta?: { href: string; label: string }
  footnote?: string
}

export function NoirEmail({ lang = 'en', siteName, preview, heading, children, cta, footnote }: Props) {
  return (
    <Html lang={lang} dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>{siteName}</Text>
          <Hr style={rule} />
          <Heading style={h1}>{heading}</Heading>
          {children}
          {cta ? (
            <Button style={button} href={cta.href}>
              {cta.label}
            </Button>
          ) : null}
          {footnote ? <Text style={foot}>{footnote}</Text> : null}
        </Container>
      </Body>
    </Html>
  )
}

/** Body paragraph in the shared style. */
export function P({ children }: { children: React.ReactNode }) {
  return <Text style={text}>{children}</Text>
}

/** Label / value rows, e.g. the details of an enquiry. */
export function Facts({ rows }: { rows: Array<[string, string | null | undefined]> }) {
  const shown = rows.filter(([, v]) => v)
  if (shown.length === 0) return null
  return (
    <>
      {shown.map(([k, v]) => (
        <Text key={k} style={fact}>
          <span style={factLabel}>{k}</span>
          <br />
          {v}
        </Text>
      ))}
    </>
  )
}

const main = { backgroundColor: '#ffffff', fontFamily: FONT, color: INK }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 16px', color: INK }
const rule = { borderColor: LINE, margin: '0 0 28px' }
const h1 = { fontSize: '24px', fontWeight: 800, lineHeight: '1.25', margin: '0 0 18px', color: INK }
const text = { fontSize: '15px', lineHeight: '1.6', color: MUTED, margin: '0 0 18px', whiteSpace: 'pre-wrap' as const }
const fact = { fontSize: '15px', lineHeight: '1.5', color: INK, margin: '0 0 12px' }
const factLabel = { fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: MUTED }
const button = { backgroundColor: INK, color: '#ffffff', fontSize: '14px', fontWeight: 500, borderRadius: '4px', padding: '13px 22px', textDecoration: 'none', margin: '8px 0 0' }
const foot = { fontSize: '12px', lineHeight: '1.5', color: MUTED, margin: '32px 0 0' }
