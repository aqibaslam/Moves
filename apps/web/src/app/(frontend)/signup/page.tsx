import type { Metadata } from 'next';
import { Poppins, Public_Sans } from 'next/font/google';
import { SignupModal } from './SignupModal';
import './signup.css';

const publicSans = Public_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-public-sans', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-poppins', display: 'swap' });

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create your Moves account — one-time email link, no password.',
};

export default function SignupPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return (
    <div className={`su ${publicSans.variable} ${poppins.variable}`}>
      <div className="su__panel" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/signup-hero.png" alt="" />
      </div>
      <div className="su__side">
        <SignupModal googleEnabled={googleEnabled} />
      </div>
    </div>
  );
}
