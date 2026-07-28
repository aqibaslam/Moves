/**
 * Seeds every landing-page global with the current live content and uploads
 * the assets from /public/images into the Media library.
 *
 * Run once (after the DB is migrated):
 *   pnpm --filter @moves/web seed
 *
 * Safe to re-run, but it will create duplicate Media records for the images.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '@payload-config';
import { getPayload } from 'payload';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(dirname, '../../public/images');

const seed = async () => {
  const payload = await getPayload({ config });
  payload.logger.info('Seeding Moves landing page…');

  const cache = new Map<string, number>();
  const up = async (file: string, alt: string): Promise<number> => {
    const cached = cache.get(file);
    if (cached !== undefined) return cached;
    const doc = await payload.create({
      collection: 'media',
      filePath: path.join(imagesDir, file),
      data: { alt },
    });
    const id = doc.id as number;
    cache.set(file, id);
    return id;
  };

  const btn = (label: string, href = '#cta') => ({ label, href });

  // ── 1 · Header (bar + nav) ─────────────────────────────────
  await payload.updateGlobal({
    slug: 'header',
    data: {
      announcementNote: 'Every MOVES® smile is signed by a named, GDC-registered dentist.',
      announcementLink: 'Meet the dentists who sign →',
      announcementMobile: 'SAVE OVER 85% ON YOUR FIRST MONTH',
      logo: await up('moves-logo.svg', 'Moves'),
      navLinks: [
        { label: 'Your Move', href: '#' },
        { label: 'Signed', href: '#' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'In motion', href: '#' },
        { label: 'The movers', href: '#' },
      ],
      button: { label: 'Book A Consultation', labelMobile: 'Consultation', href: '#cta' },
      showCart: true,
    },
  });

  // ── 2 · Hero ───────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'hero',
    data: {
      ratingCount: 'Excellent (3,890)',
      headline: { accent: 'The smile', rest: 'you’ve been putting off' },
      subhead:
        'MOVES is the movement behind modern smiles. Planned in person, signed by a named GDC-registered dentist, at a price we publish. The smile is yours, the signature means you never move alone.',
      primaryButton: btn('Book Free Consultation'),
      secondaryLinkLabel: 'See exactly what it costs',
      heroImage: await up('hero-portrait.png', 'Smiling patient'),
      signature: {
        name: 'Amelia Hart',
        line1: 'SIGNED · GDC No. 123456',
        line2: 'ON THE PLAN. IN YOUR ACCOUNT. ON THE BOX.',
      },
    },
  });

  // ── 3 · Problem ────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'problem',
    data: {
      eyebrow: 'THE MOVES YOU ALREADY MAKE',
      heading: { accent: 'Just the wrong ones.', rest: 'Your’ve been making moves for years.' },
      items: [
        { text: 'Closed-mouth photo', image: await up('problem-portrait.png', 'Portrait') },
        { text: 'Hand over your mouth, mid-laugh', image: await up('hero-portrait.png', 'Portrait') },
        { text: 'Turn away from the camera', image: await up('manifesto-woman.png', 'Portrait') },
        { text: 'Photo you took, then deleted.', image: await up('ba-1-before.png', 'Portrait') },
        { text: '“Careful” smile.', image: await up('ba-1-after.png', 'Portrait') },
        { text: 'Camera off, again.', image: await up('ba-2-before.png', 'Portrait') },
      ],
      note: 'Nobody buys aligners. People buy the moment they stop hiding. If you recognise more than two of these, you already know which moment we mean.',
    },
  });

  // ── 3 · Manifesto ──────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'manifesto',
    data: {
      eyebrow: 'WHY WE’RE CALLED MOVES',
      heading: {
        bright: 'Moves is',
        dim: 'not a clear aligner company. It is the moment behind modern smiles.',
      },
      subtext:
        'Aligner brands sell trays. Trays are the mechanism, the move is the product: from still to moving, from hiding to shown. Everything on this page is just how we get you there.',
      button: btn('Book Free Consultation'),
      backgroundImage: await up('manifesto-bg.png', ''),
      portrait: await up('manifesto-woman.png', 'A person laughing'),
    },
  });

  // ── 4 · Marquee ────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'marquee',
    data: {
      words: [
        'MAKING MOVES',
        'SMILES IN MOTION',
        'YOUR MOVE',
        'FIRST MOVE',
        'SIGNED',
        'SIGNED',
        'SMILES IN MOTION',
        'FIRST MOVE',
      ].map((text) => ({ text })),
    },
  });

  // ── 5 · How it works ───────────────────────────────────────
  await payload.updateGlobal({
    slug: 'how-it-works',
    data: {
      eyebrow: 'HOW IT WORKS',
      heading: { accent: 'You move,', rest: 'in Three moves' },
      subtext:
        'No postal impression kits. No anonymous review team. A dentist, a scanner, a signature then motion.',
      button: btn('Book Free Consultation'),
      steps: [
        {
          stepLabel: 'STEP 01',
          title: 'Scan day',
          body: 'Twenty minutes, in person, with a dentist. A 3D scan — and if aligners won’t work for you, we say so, and you pay nothing.',
          image: await up('step1-a.png', 'Scan day'),
          imageOverlay: await up('step1-b.png', ''),
        },
        {
          stepLabel: 'STEP 02',
          title: 'The signed plan',
          body: 'Every stage of the move, on screen, before you pay a pound. Signed by name, with a GDC number you can look up in eight seconds.',
          image: await up('step2.png', 'The signed plan'),
        },
        {
          stepLabel: 'STEP 03',
          title: 'In motion',
          body: 'Aligners made in Germany, finished by hand, delivered to your door. Check-ins reach you before you have to ask, stage by stage.',
          image: await up('step3.png', 'In motion'),
        },
      ],
    },
  });

  // ── 6 · Before & Afters ────────────────────────────────────
  await payload.updateGlobal({
    slug: 'before-afters',
    data: {
      eyebrow: 'BEFORE AND AFTERS',
      heading: { accent: 'Real moves.', rest: 'Signed.' },
      subtext: 'Every case unretouched, originals on file, signed by the dentist responsible.',
      cards: [
        {
          name: 'Lisa A.',
          quote:
            '“I started eight months before my wedding so I wouldn’t spend the photos doing my careful smile. Best line in the whole planning spreadsheet.”',
          signedBy: 'Signed by Dr. Amelia Hart',
          gdc: 'GDC: 251837',
          beforeImage: await up('ba-1-before.png', 'Lisa before'),
          afterImage: await up('ba-1-after.png', 'Lisa after'),
        },
        {
          name: 'Priya R.',
          quote:
            '“I used to talk with my hand near my mouth without noticing. Now I catch myself grinning in meetings. Nobody warned me about that part.”',
          signedBy: 'Signed by Dr. Amir Hussain',
          gdc: 'GDC: 251837',
          beforeImage: await up('ba-2-before.png', 'Priya before'),
          afterImage: await up('ba-2-after.png', 'Priya after'),
        },
        {
          name: 'Sarah M.',
          quote:
            '“Fourteen weeks. The plan on my screen said fourteen weeks, and it was fourteen weeks. I’ve had sofas take longer to arrive.”',
          signedBy: 'Signed by Dr. Amelia Hart',
          gdc: 'GDC: 251837',
          beforeImage: await up('ba-2-before.png', 'Sarah before'),
          afterImage: await up('ba-2-after.png', 'Sarah after'),
        },
        {
          name: 'Tom W.',
          quote:
            '“I stopped editing my smile out of photos, then noticed I’d started smiling in them. That’s the whole review, really.”',
          signedBy: 'Signed by Dr. Amir Hussain',
          gdc: 'GDC: 251837',
          beforeImage: await up('ba-4-before.png', 'Tom before'),
          afterImage: await up('ba-4-after.png', 'Tom after'),
        },
      ],
    },
  });

  // ── 7 · Pricing ────────────────────────────────────────────
  const features = ['Dual Arch', '4—6 months treatment time', 'Crowding on 6-8 teeth', 'Bite correction'].map(
    (text) => ({ text }),
  );
  await payload.updateGlobal({
    slug: 'pricing',
    data: {
      eyebrow: 'PRICING',
      heading: { accent: 'Exactly what', rest: 'Moves costs' },
      subtext:
        'Some brands make you book a call to learn a price. Ours are published. Every package, in full, before you’ve given us so much as an email address. That’s it. That’s the section.',
      plans: [
        {
          title: 'Clear aligners',
          price: '£16.30',
          per: '/per month',
          productImage: await up('pricing-product.png', 'Clear aligner'),
          features,
          buttonLabel: 'Book Free Consultation',
          variant: 'pink',
        },
        {
          title: 'Composite Bonding',
          price: '£16.30',
          per: '/per month',
          productImage: await up('pricing-product.png', 'Composite bonding'),
          features,
          buttonLabel: 'Book Free Consultation',
          variant: 'navy',
        },
      ],
    },
  });

  // ── 8 · Reviews ────────────────────────────────────────────
  const reviewBody =
    'With Capable, I’ve expanded my network and found genuine connections. The seamless interface makes socializing so much easier.';
  await payload.updateGlobal({
    slug: 'reviews',
    data: {
      ratingCount: 'Excellent (3,890)',
      heading: { accent: 'Don’t take', rest: 'our word for it' },
      viewMoreLabel: 'View more',
      reviews: Array.from({ length: 6 }).map(() => ({
        author: 'Pauline,',
        timeAgo: '5 hours ago',
        title: 'Moves is genius',
        body: reviewBody,
      })),
    },
  });

  // ── 9 · Team ───────────────────────────────────────────────
  const teamPhoto = await up('team-photo.png', 'Dr. Amir Hussain');
  await payload.updateGlobal({
    slug: 'team',
    data: {
      eyebrow: 'OUR TEAM',
      heading: { accent: 'The names', rest: 'behind the smiles.' },
      subtext:
        'Every MOVES plan is signed by one of these dentists. Every one of them is on the GDC register, check for yourself.',
      button: btn('Book Free Consultation'),
      members: Array.from({ length: 4 }).map(() => ({
        name: 'Dr. Amir Hussain',
        role: 'Moves Verified Dentist',
        gdc: 'GDC No. 12345',
        photo: teamPhoto,
      })),
    },
  });

  // ── 10 · Proof in motion ───────────────────────────────────
  await payload.updateGlobal({
    slug: 'proof',
    data: {
      eyebrow: 'PROOF IN MOTION',
      heading: { accent: 'Real Smiles,', rest: 'real Stories' },
      subtext:
        'MOVES isn’t a box in the post. Every patient is examined, scanned and fitted in person by a GDC-registered dentist, and every treatment plan carries that dentist’s signature.',
      videos: [
        { thumbnail: await up('proof-1.png', 'Patient story') },
        { thumbnail: await up('proof-2.png', 'Patient story') },
        { thumbnail: await up('proof-3.png', 'Patient story') },
        { thumbnail: await up('proof-4.png', 'Patient story') },
        { thumbnail: await up('proof-3.png', 'Patient story') },
      ],
    },
  });

  // ── 11 · The Movers ────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'movers',
    data: {
      eyebrow: 'THE MOVERS',
      heading: { accent: 'You don’t buy moves.', rest: 'You join it.' },
      subtext:
        'Every patient becomes a Mover on scan day: a code of your own, rewards when a friend makes their move, first look at whatever we do next. The best Movers end up making the brand with us.',
      button: btn('Book Free Consultation'),
      tiers: [
        {
          icon: await up('icon-target.svg', ''),
          title: 'Mover',
          body: 'You make the first move: scan day, your own code, your smile in motion.',
        },
        {
          icon: await up('icon-megaphone.svg', ''),
          title: 'Advocate',
          body: 'A friend moves on your code. You both get rewarded, every time.',
        },
        {
          icon: await up('icon-folder-edit.svg', ''),
          title: 'Creator',
          body: 'Your story becomes the brand: shoots, features, your move on our channels.',
        },
        {
          icon: await up('icon-shield-half.svg', ''),
          title: 'Insider',
          body: 'First look at everything next. New products, new cities, before anyone.',
        },
      ],
    },
  });

  // ── 12 · CTA banner ────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'cta',
    data: {
      title: 'Your MOVE',
      subtext: 'A free consultation, an honest answer, and a plan with a name on it.',
      button: btn('Book Free Consultation'),
      backgroundImage: await up('cta-bg.png', ''),
      badge: { topLabel: 'Money back', midLabel: 'Guarantee', bigNumber: '30', bottomLabel: 'days' },
    },
  });

  // ── 13 · FAQs ──────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'faqs',
    data: {
      eyebrow: 'FAQS',
      heading: { accent: 'Frequently', rest: 'asked questions' },
      items: [
        { question: 'What is MOVES?', answer: 'MOVES is the movement behind modern smiles: a clear-aligner treatment planned in person and signed by a named, GDC-registered dentist, at a price we publish up front.' },
        { question: 'Who signs my treatment plan?', answer: 'A named, GDC-registered dentist examines and scans you in person, then signs your plan. Their GDC number is on the plan so you can look them up in eight seconds.' },
        { question: 'How do I know if aligners are right for me?', answer: 'Book a free consultation. A dentist takes a 3D scan in person and tells you honestly whether aligners will work for you — and if they won’t, you pay nothing.' },
        { question: 'How much does MOVES cost?', answer: 'Every package is published in full before you give us so much as an email address. Clear aligners start from £16.30 per month.' },
        { question: 'How long does treatment take?', answer: 'Most moves take four to six months. Your exact timeline is shown on your signed plan, stage by stage, before you pay a pound.' },
        { question: 'Do I need clinic appointments?', answer: 'You’re examined, scanned and fitted in person at the start. After that your aligners are delivered to your door and check-ins reach you before you have to ask.' },
        { question: 'Are MOVES aligners painful?', answer: 'Expect mild pressure for a day or two each time you move to a new stage — that’s the teeth moving. It settles quickly and most people adjust within a week.' },
        { question: 'What happens while I’m wearing aligners?', answer: 'Wear each set around 22 hours a day, taking them out to eat and clean your teeth, and swap to the next stage on schedule. We check in with you along the way.' },
        { question: 'How do I start?', answer: 'Book a free consultation. Scan day takes about twenty minutes in person with a dentist — that’s the whole first move.' },
      ],
    },
  });

  // ── 14 · Footer ────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      navLinks: ['Shop', 'About', 'Science', 'FAQs', 'Contact'].map((label) => ({ label, href: '#' })),
      socialLinks: [
        { platform: 'instagram', href: '#' },
        { platform: 'tiktok', href: '#' },
        { platform: 'email', href: '#' },
      ],
      mailingLabel: 'join our mailing list',
      emailPlaceholder: 'YOUR EMAIL',
      wordmark: await up('moves-wordmark.svg', 'Moves'),
      copyright: '© Copyright 2026 Moves',
    },
  });

  payload.logger.info('✅ Seed complete — all 14 sections populated.');
};

// Top-level await so `payload run` waits for the whole seed to finish
// before the process exits.
try {
  await seed();
  process.exit(0);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
}
