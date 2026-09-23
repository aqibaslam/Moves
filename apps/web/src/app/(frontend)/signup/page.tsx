import type { Metadata } from 'next';
import { SignupModal } from './SignupModal';
import './signup.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create your Moves account — one-time email link, no password.',
};

export default function SignupPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return (
    <div className="su">
      <div className="su__panel" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/cta-woman.png" alt="" />
      </div>
      <div className="su__side">
        <SignupModal googleEnabled={googleEnabled} />
      </div>
    </div>
  );
}
