/* Process (Figma §7) — "Your first move to your last tray, in plain English".
   Left = sticky heading, right = numbered "Move" rows with thumbnails. */

interface Move {
  num: string;
  title: string;
  body: string;
  image?: string;
}

const MOVES: Move[] = [
  {
    num: 'Move 1',
    title: 'Free Online Consultation',
    body: "Tell us what's bothering you and share a few photos. We'll tell you honestly whether aligners can help.",
    image: '/images/funnel/03d011c1d1ac.png',
  },
  {
    num: 'Move 2',
    title: 'Get Scanned In Person',
    body: 'Visit a clinic for a 3D scan and a proper look from a GDC-registered dentist. No postal impression kits.',
    image: '/images/funnel/process-1.png',
  },
  {
    num: 'Move 3',
    title: 'See Your Signed Plan',
    body: 'Your dentist signs off a plan with a digital preview of exactly how your teeth will move.',
    image: '/images/funnel/10f8b9fee8ac.png',
  },
  {
    num: 'Move 4',
    title: 'Aligners Delivered',
    body: 'Your full set of aligners, made in Germany, arrives at your door with everything you need to start.',
    image: '/images/funnel/0101d59b862c.png',
  },
  {
    num: 'Move 5',
    title: 'Checked At Every Tray',
    body: 'We check in at every tray change — before you have to ask — so nothing drifts off plan.',
    image: '/images/funnel/3e38cc9ebdf5.png',
  },
  {
    num: 'Move 6',
    title: 'Retain Your New Smile',
    body: "Finish with retainers and whitening included, and a smile that's yours to keep.",
  },
];

export function Process() {
  return (
    <section className="card-section f-process">
      <div className="f-process__intro">
        <p className="eyebrow">How does it work?</p>
        <h2 className="h-section">
          Your first move to your last tray, <span className="c">in plain English</span>
        </h2>
        <p className="lead">
          No postal impression kits. No anonymous call centre. A guided journey from your first
          consultation to your last tray — with a name on every step.
        </p>
      </div>

      <div className="f-process__list">
        {MOVES.map((m) => (
          <div className="f-move" key={m.num}>
            <div className="f-move__media">
              {m.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.image} alt={m.title} />
              )}
            </div>
            <div className="f-move__text">
              <span className="f-move__num">{m.num}</span>
              <h3 className="f-move__title">{m.title}</h3>
              <p className="f-move__body">{m.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
