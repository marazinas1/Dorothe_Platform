import * as React from 'react'

import { NoirEmail, P } from './layout'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, confirmationUrl }: InviteEmailProps) => (
  <NoirEmail
    siteName={siteName}
    preview={`You have been invited to ${siteName}`}
    heading="You have been invited"
    cta={{ href: confirmationUrl, label: 'Accept invitation' }}
    footnote="If you were not expecting this invitation, you can ignore this email."
  >
    <P>You have been invited to manage the website of {siteName}. Accept the invitation to set your password and sign in.</P>
  </NoirEmail>
)

export default InviteEmail
