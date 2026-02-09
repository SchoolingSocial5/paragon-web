import ResetSuccessful from '@/components/Public/Auth/ResetSuccessful'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Reset Password Successful | Paragon',
  description:
    'Congratulations, your Paragon account has been created successfully.',
  twitter: {
    card: 'summary',
    site: '@paragon',
  },
})

export default function SignInClient() {
  return (
    <>
      <ResetSuccessful />
    </>
  )
}
