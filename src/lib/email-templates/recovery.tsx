import * as React from 'react'

import { NoirEmail, P } from './layout'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <NoirEmail
    siteName={siteName}
    preview={`Reset your password for ${siteName}`}
    heading="Reset your password"
    cta={{ href: confirmationUrl, label: 'Choose a new password' }}
    footnote="If you did not ask for this, you can ignore this email. Your password stays the same."
  >
    <P>We received a request to reset your password for {siteName}. Use the button below to choose a new one.</P>
  </NoirEmail>
)

export default RecoveryEmail
