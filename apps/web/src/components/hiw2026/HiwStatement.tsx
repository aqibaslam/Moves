import { BOOKING_PATH } from '@/lib/booking/links';
import { ScrollRevealText } from '@/components/landing/ScrollRevealText';
import { Marquee, type MarqueeData } from '@/components/landing/Marquee';

/* "Aligners are not for everyone. we will tell you honestly" (Figma 984:10596) —
   a navy band with a big scroll-lit statement, a coral CTA, and the word marquee
   along the bottom. */
export function HiwStatement({ data }: { data?: MarqueeData }) {
  return (
    <section className="hiw-stmt">
      <div className="hiw-stmt__inner">
        <h2 className="hiw-stmt__title">
          <ScrollRevealText text="Aligners are not for everyone. we will tell you honestly" />
        </h2>
        <a className="btn lp26-btn hiw-stmt__cta" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>
      <Marquee data={data} />
    </section>
  );
}
