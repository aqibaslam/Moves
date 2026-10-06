import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ActionLink, Arrow, Button, CareMark, Check, Choice, Disclosure, Eyebrow, Field, Wordmark } from '@/components/moves-system/Primitives';
import { BOOKING_PATH } from '@/lib/booking/links';
import { consultationCopy } from '@/components/moves-system/content';
import s from './system.module.css';

export const metadata: Metadata = { title: 'MOVES — Digital design foundation', description: 'The working MOVES website design system: foundations, components, photography and first-screen application.' };

function Section({ id, index, title, description, children }: { id: string; index: string; title: string; description: string; children: ReactNode }) {
  return <section id={id} className={s.section}><div className={s.sectionIntro}><span className={s.index}>{index}</span><div><h2>{title}</h2><p>{description}</p></div></div>{children}</section>;
}

function Note({ children }: { children: ReactNode }) { return <p className={s.note}>{children}</p>; }

export default function DesignSystemPage() {
  return <>
    <header className={s.header}><Link href="/first-move" aria-label="MOVES landing page"><Wordmark /></Link><span>THE DIGITAL FOUNDATION</span><Link className={s.previewLink} href="/first-move">View landing page <Arrow /></Link></header>
    <main id="main" tabIndex={-1}>
      <div className={s.cover}>
        <div className={s.coverCopy}><Eyebrow tab>MOVES / Digital language</Eyebrow><h1>Considered.<br />Down to the detail.</h1><p>A confident identity. A clear next step.<br />One system, from first impression to first Move.</p><div className={s.coverMeta}><span>Brand Guidelines v1.3</span><span>Working design foundation · 03</span></div></div>
        <div className={s.coverArt}><Image src="/images/first-move/life-in-motion.webp" alt="Original MOVES candid campaign photography." fill sizes="(max-width: 767px) 100vw, 40vw" priority /><div className={s.coverArtLabel}><Wordmark inverse /><span>IN MOTION</span></div></div>
      </div>
      <nav className={s.sectionNav} aria-label="Design system sections"><a href="#identity">Identity</a><a href="#type">Typography</a><a href="#actions">Actions</a><a href="#inputs">Inputs</a><a href="#patterns">Patterns</a><a href="#photography">Photography</a><a href="#layout">Layout</a></nav>
      <div className={s.content}>
        <Section id="identity" index="01" title="Quiet colour. Clear purpose." description="Ink and Milk carry the identity. Stone adds warmth. Pulse is a small, recognisable interruption.">
          <div className={s.swatches}>
            {[['Ink','#091620','Actions · type · dark surfaces','ink'],['Milk','#FFFFFF','Canvas · inverse text','milk'],['Stone','#EDEAE6','Supporting surfaces','stone'],['Pulse','#ED3B44','Brand detail','pulse'],['Blush','#FFE8E9','Soft accent','blush']].map(([name,hex,role,key])=><div key={key} className={s.swatch} data-colour={key}><span>{name}</span><div><code>{hex}</code><small>{role}</small></div></div>)}
          </div>
          <div className={s.identityRules}><div><h3>A mark with its own movement.</h3><p>The supplied MOVES wordmark keeps its distinctive lowered V. It is placed as artwork, with space to breathe.</p></div><div className={s.logoSpecimen}><Wordmark /><span>160px minimum · original proportions</span></div><div className={s.tabSpecimen}><span aria-hidden="true" /><p>The Pulse tab.<br /><small>A detail drawn from the packaging.</small></p></div></div>
          <Note>Buttons use Ink with Milk lettering: 18.3:1 contrast. Pulse is reserved for short marks and large accents. Body copy stays Ink or a tested neutral.</Note>
        </Section>
        <Section id="type" index="02" title="The voice, made visible." description="Glacial Indifference for character. Public Sans for clarity. Two typefaces, with distinct jobs.">
          <div className={s.typeDisplay}><span className={s.specLabel}>GLACIAL INDIFFERENCE / REGULAR</span><p>Your smile.<br />Your story. Your Move<span>.</span></p><div className={s.typeAlphabet}>Aa Bb Cc Dd Ee Ff Gg<br />0123456789 &amp; £ ! ?</div></div>
          <div className={s.typeScale}>
            <div><span>Display / 64</span><p className={s.displaySample}>Make your Move.</p></div>
            <div><span>Section / 32–40</span><p className={s.sectionSample}>Care that knows you.</p></div>
            <div><span>Heading / 24</span><p className={s.headingSample}>A plan, made personal.</p></div>
            <div><span>Body / 17</span><p className={s.bodySample}>Clear aligners, a personal plan and a named dentist behind it. The details should make your next step easier.</p></div>
            <div><span>Utility / 14</span><p className={s.utilitySample}>Free online consultation. No obligation.</p></div>
            <div><span>Label / 13</span><Eyebrow>MOVES CLEAR ALIGNERS</Eyebrow></div>
          </div>
          <Note>Sentence case. Regular display weight. Tight headline spacing; relaxed body leading. On small screens, headlines scale down while body text remains readable.</Note>
        </Section>
        <Section id="actions" index="03" title="One clear next step." description="A filled primary action, a quiet secondary action and an inverse for dark surfaces. Every action uses a horizontal arrow. Complete labels stay consistent on every screen.">
          <div className={s.actionVariants}>
            <div className={s.componentTile}><span className={s.specLabel}>PRIMARY / INK</span><ActionLink href={BOOKING_PATH}>{consultationCopy.action}</ActionLink><p>The main conversion action.<br />One per decision point.</p></div>
            <div className={s.componentTile}><span className={s.specLabel}>SECONDARY / OUTLINE</span><ActionLink href="/first-move" variant="secondary">Explore MOVES</ActionLink><p>Supporting navigation.<br />Visually below the primary action.</p></div>
            <div className={`${s.componentTile} ${s.darkTile}`}><span className={s.specLabel}>INVERSE / MILK</span><ActionLink href="/first-move" variant="inverse">Make your Move</ActionLink><p>For Ink surfaces.<br />The same geometry and behaviour.</p></div>
          </div>
          <div className={s.states}>
            <div><span>Rest</span><Button>Continue</Button></div><div><span>Hover</span><Button data-preview-state="hover">Continue</Button></div><div><span>Keyboard focus</span><Button data-preview-state="focus">Continue</Button></div><div><span>Unavailable</span><Button disabled>Continue</Button></div>
          </div>
          <Note>56px primary height · 44px compact height · 4px corner · visible 2px focus ring · 140ms arrow movement · reduced motion supported. Hover preserves the brand colour and moves only the arrow. Disabled controls use explicit Stone and neutral colours, never opacity. The controls can be reached with Tab.</Note>
        </Section>
        <Section id="inputs" index="04" title="Less effort. More certainty." description="Labels stay visible. Selection is explicit. Errors explain the correction beside the field.">
          <div className={s.formGrid}><div className={s.formPanel}><Field id="sample-name" label="First name" placeholder="Your first name" autoComplete="given-name" /><Field id="sample-email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" hint="We’ll use this for your consultation details." /><Field id="sample-error" label="Email address · error example" type="email" defaultValue="alex@" error="Enter a complete email address, such as alex@example.com." /><Field id="sample-disabled" label="Unavailable field" value="An example of a disabled field" disabled /></div>
            <div className={s.choicePanel}><fieldset><legend>What would you like to explore?</legend><p className={s.muted}>Interactive component example</p><Choice name="demo-interest" value="aligners" defaultChecked>Clear aligners</Choice><Choice name="demo-interest" value="care">The care behind your plan</Choice><Choice name="demo-interest" value="questions">I have a few questions</Choice></fieldset><div className={s.feedback}><Check /><p><strong>A clear confirmation.</strong><br />Success messages explain what happens next.</p></div><Note>These are design specimens. Entries remain in this page; no form is submitted.</Note></div></div>
        </Section>
        <Section id="patterns" index="05" title="A family of useful details." description="Small components carry the same visual rules into later sections, without repeating the hero everywhere.">
          <div className={s.patternGrid}><div className={s.careSpecimen}><Eyebrow tab>THE CARE MARKER</Eyebrow><CareMark /><p>Reassurance belongs close to a decision. Use real, attributable evidence when patient stories and reviews are added.</p></div><div className={s.disclosureSpecimen}><Eyebrow>QUESTIONS / DISCLOSURE</Eyebrow><Disclosure question="What should an answer feel like?"><p>Direct, helpful and easy to scan. Put the answer first, then the detail needed to make an informed choice.</p></Disclosure><Disclosure question="How does this work on mobile?"><p>The whole question row is a touch target. Native disclosure controls work with a keyboard and without JavaScript.</p></Disclosure></div></div>
          <div className={s.cardExamples}><article className={s.editorialCard}><span className={s.specLabel}>EDITORIAL SURFACE</span><h3>A little more<br />room to smile.</h3><p>One clear thought. A short explanation. Enough space to absorb both.</p><a href="#photography">See the image direction <Arrow /></a></article><article className={s.darkCard}><Eyebrow tab>INK SURFACE</Eyebrow><h3>Personal care.<br />Considered details.</h3><p>Use a dark surface to mark a meaningful change in the story.</p><ActionLink href="/first-move" variant="inverse">View the first section</ActionLink></article></div>
        </Section>
        <Section id="photography" index="06" title="Life first. Product in context." description="Original campaign photography, selected for warmth, recognisable details and a natural sense of movement.">
          <div className={s.photoGrid}><figure><div><Image src="/images/first-move/life-in-motion.webp" alt="MOVES model laughing naturally with a friend." fill sizes="(max-width: 767px) 100vw, 40vw" /></div><figcaption><strong>Candid / the connection</strong><span>DSC00749 · selected hero</span></figcaption></figure><figure><div><Image src="/images/first-move/aligner-detail.webp" alt="An open aligner case held in a hand against green leaves." fill sizes="(max-width: 767px) 50vw, 25vw" /></div><figcaption><strong>Product / the detail</strong><span>DSC00840 · paired with hero</span></figcaption></figure><figure><div><Image src="/images/first-move/everyday-movement.webp" alt="Original MOVES lifestyle photography on a rooftop." fill sizes="(max-width: 767px) 50vw, 25vw" /></div><figcaption><strong>Portrait / the character</strong><span>DSC00545 · reserved for later</span></figcaption></figure></div>
          <div className={s.photoRules}><p><strong>Keep it human.</strong> Preserve skin texture, smiles and natural light. Campaign models are never presented as patient results.</p><p><strong>Compose for each screen.</strong> Keep faces unobstructed and the product recognisable. Mobile gets its own crop and content order.</p><p><strong>Give each image a job.</strong> A candid portrait creates connection. A close detail explains the product. Use concept renders only as references.</p></div>
        </Section>
        <Section id="layout" index="07" title="A rhythm the whole site can share." description="A 12-column desktop grid, a simple mobile stack and a small spacing scale keep future sections related.">
          <div className={s.gridSpecimen} aria-label="Twelve equal desktop grid columns">{Array.from({length:12},(_,i)=><span key={i}>{i+1}</span>)}</div><div className={s.spaceScale}>{['4','8','12','16','24','32','48','64','96'].map(v=><div key={v}><span className={s.spaceBar} data-space={v} /><span>{v}</span></div>)}</div>
          <div className={s.layoutRules}><p><strong>Desktop</strong>12 columns · 1,536px frame<br />Fluid 20–64px gutters<br />96px section rhythm</p><p><strong>Mobile</strong>One purposeful reading order<br />20px content inset<br />56px section rhythm</p><p><strong>Interaction</strong>44px minimum touch target<br />Visible focus on every control<br />No essential motion</p></div>
          <div className={s.scopeNote}><Eyebrow>APPLICATION / FIRST VIEW</Eyebrow><h3>Announcement. Header. Hero.</h3><p>The first application uses the same components shown here. Later landing-page sections remain for the next design stage.</p><ActionLink href="/first-move">Open the landing page</ActionLink></div>
        </Section>
      </div>
    </main><footer className={s.footer}><Wordmark /><p>Digital foundation · Working review<br />Built from MOVES Brand Guidelines v1.3</p><Link href="/first-move">Make your Move. <Arrow /></Link></footer>
  </>;
}
