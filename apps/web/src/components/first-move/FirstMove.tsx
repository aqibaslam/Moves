import Image from 'next/image';
import Link from 'next/link';
import { BOOKING_PATH } from '@/lib/booking/links';
import { ActionLink, Arrow, CareMark, Eyebrow, Wordmark } from '@/components/moves-system/Primitives';
import { consultationCopy } from '@/components/moves-system/content';
import s from './first-move.module.css';

export function Announcement() {
  return <aside className={s.announcement} aria-label="Your first step with MOVES"><span className={s.announcementLead}>A named dentist. A plan that’s yours.</span><Link href={BOOKING_PATH}>{consultationCopy.action} <Arrow /></Link></aside>;
}

export function CampaignHeader() {
  return <header className={s.header}><div className={s.headerInner}>
    <Link className={s.brand} href="/first-move" aria-label="MOVES — back to the start"><Wordmark /></Link>
    <span className={s.headerDescriptor}>CLEAR ALIGNERS.<br />CONSIDERED CARE.</span>
    <nav className={s.navigation} aria-label="Main navigation"><Link className={s.howLink} href="/how-it-works">How it works</Link><div className={s.headerAction}><ActionLink href={BOOKING_PATH} variant="secondary" compact>{consultationCopy.action}</ActionLink></div></nav>
  </div></header>;
}

export function CampaignHero() {
  return <main id="main" tabIndex={-1} className={s.main}>
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.copy}>
        <div className={s.heading}><Eyebrow>MOVES clear aligners</Eyebrow>
        <h1 id="hero-title" className={s.title}><span>Make your</span>{' '}<span className={s.move}>Move.</span></h1></div><div className={s.copyBody}>
        <p className={s.description}>Clear aligners, with a personal plan and care from a named dentist.</p>
        <div className={s.action}><ActionLink href={BOOKING_PATH} id="consultation-cta">{consultationCopy.action}</ActionLink><p className={s.microcopy}>{consultationCopy.reassurance}</p></div></div>
      </div>
      <div className={s.visual}>
        <figure className={s.portraitFrame}>
          <Image src="/images/first-move/life-in-motion.webp" alt="A MOVES campaign model laughing with a friend in a sunlit garden." fill preload sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 64vw" className={s.portrait} />
          <figcaption className={s.imageCaption}><span>IN MOTION</span><span>Small moves can change a lot.</span></figcaption>
        </figure>
        <figure className={s.productFrame}>
          <div className={s.productImage}><Image src="/images/first-move/aligner-detail-hd.webp" alt="Clear aligners in an open MOVES case, held in one hand." fill sizes="(max-width: 1023px) 112px, 36vw" className={s.productPhoto} /></div>
          <figcaption>MOVES clear aligners</figcaption>
        </figure>
      </div>
      <div className={s.heroFoot}>
        <CareMark />
        <div className={s.firstStep}><span className={s.stepLabel}>YOUR FIRST MOVE</span><p>A conversation about your smile.<br /><span>Find out what’s possible for you.</span></p></div>
      </div>
    </section>
  </main>;
}
