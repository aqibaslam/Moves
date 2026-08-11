import { Check } from '@/components/landing/icons';
import { BOOKING_PATH } from '@/lib/booking/links';

/* Candidacy (Figma §8) — "Aligners aren't for everyone. Here's the honest list." */

/* Moves brand mark shown to the right of the "What we treat" heading (Figma "Subtract 1"). */
function TreatMark() {
  return (
    <svg width="20" height="18" viewBox="0 0 22 20" fill="currentColor" aria-hidden="true">
      <path d="M3.75683 10.0273C3.76283 11.6309 4.39023 13.1772 5.51764 14.3705C6.64503 15.5638 8.19518 16.3224 9.87245 16.5007H11.413C12.7407 16.3619 13.9969 15.8557 15.0257 15.0464C15.3586 14.7844 15.6644 14.493 15.94 14.1767L16.056 14.0425C16.1714 13.9023 16.2793 13.7614 16.384 13.6135L16.485 13.4661C16.5815 13.3184 16.6756 13.1626 16.7534 13.0073C16.8097 12.9002 16.8674 12.7929 16.9157 12.6859C16.964 12.5788 17.0142 12.4685 17.0598 12.3563L17.1261 12.1873C17.2098 11.9609 17.2823 11.7303 17.3397 11.4966C17.4588 11.0153 17.5198 10.5217 17.5219 10.0273H21.2788L21.0717 10.4033C20.9969 12.2338 20.392 14.0091 19.3225 15.5333C19.0871 15.8704 18.8299 16.194 18.5523 16.5007C17.5653 17.5981 16.3392 18.479 14.9594 19.0831C13.5796 19.6873 12.0776 20.0008 10.5582 20.0008C9.0392 20.0007 7.53826 19.6871 6.15869 19.0831C4.77895 18.479 3.55279 17.598 2.56584 16.5007C2.28823 16.194 2.03104 15.8704 1.79559 15.5333C1.73394 15.4468 1.67504 15.355 1.61338 15.2633V15.2484C1.55978 15.1619 1.50035 15.0723 1.4494 14.9933L1.43283 14.9668C1.37929 14.8803 1.328 14.7906 1.27712 14.7117L1.26056 14.6786C1.20991 14.5924 1.16445 14.5013 1.11645 14.4252L1.09823 14.3904C1.05267 14.3013 1.00859 14.2096 0.965711 14.1154L0.949147 14.0823C0.906326 13.9907 0.864046 13.8964 0.826569 13.8024V13.7759C0.783731 13.6792 0.743143 13.5819 0.705648 13.4827V13.4678C0.625273 13.2641 0.552979 13.0579 0.488653 12.8466V12.83C0.45923 12.7284 0.429277 12.6269 0.402518 12.5252V12.4938C0.378373 12.3944 0.351093 12.295 0.329634 12.1956V12.1525C0.308195 12.0532 0.28445 11.9537 0.268345 11.8544V11.808C0.249557 11.7085 0.2331 11.6085 0.216995 11.5065V11.4585C0.200911 11.3591 0.187334 11.2572 0.173927 11.1553V11.1123C0.173927 11.0078 0.152168 10.9028 0.144111 10.8009V10.7346C0.144111 10.625 0.128574 10.5172 0.12589 10.405L0 10.0273H3.75683Z" />
      <path d="M19.3399 3.45536L18.5348 3.49677C16.8531 3.67724 15.2995 4.43965 14.1717 5.63856C13.044 6.83746 12.4197 8.3888 12.4192 9.99669V10.0248H8.6624V9.99669C8.66121 8.38856 8.03639 6.83741 6.90821 5.63856C5.78002 4.43971 4.2271 3.67719 2.54512 3.49677L1.80469 3.45536L1.82622 0C3.34032 0.00278044 4.83638 0.317584 6.21085 0.920987C7.58509 1.52439 8.8054 2.40321 9.78878 3.49677C10.0667 3.80473 10.3254 4.12833 10.5623 4.46579C10.7975 4.12787 11.0548 3.80411 11.3326 3.49677C12.3175 2.40146 13.5403 1.52119 14.9171 0.917674C16.2942 0.314153 17.7936 0.000884622 19.3101 0H19.3399V3.45536Z" />
    </svg>
  );
}

const TREAT = [
  'Mild to moderate crowding',
  'Gaps and small spacing',
  'Mild rotation',
  'Relapse from teenage braces (teeth that drifted back)',
  "A single tooth that's shifted",
];

const NOT = [
  'Bite problems caused by jaw position rather than teeth',
  'Gaps left by missing teeth, or replacing missing teeth',
  'Active gum disease or unstable gums',
  'Teeth that are still developing',
];

function Cross() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Candidacy() {
  return (
    <section className="card-section f-cand">
      <div className="f-cand__head">
        <div className="f-cand__head-l">
          <p className="eyebrow">Candidacy</p>
          <h2 className="h-section f-cand__title-h">
            <span className="c">Aligners aren&rsquo;t for everyone.</span> Here&rsquo;s the honest
            list.
          </h2>
          <p className="lead">
            Not sure where you sit? That&rsquo;s what the free consultation is for. If aligners
            aren&rsquo;t your move, we&rsquo;ll say so and point you to the right treatment instead,
            with a full refund if your dentist finds you&rsquo;re not a candidate after you&rsquo;ve
            paid.
          </p>
        </div>
        <a className="btn btn--navy f-cand__cta" href={BOOKING_PATH}>
          Book Free Consultation
        </a>
      </div>

      <div className="f-cand__cards">
        <div className="f-cand__card f-cand__card--treat">
          <div className="f-cand__cardhead">
            <h3 className="f-cand__title">What we treat</h3>
            <TreatMark />
          </div>
          <ul className="f-cand__list">
            {TREAT.map((t) => (
              <li className="f-cand__item f-cand__item--yes" key={t}>
                <Check />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="f-cand__card f-cand__card--not">
          <h3 className="f-cand__title">May not suit</h3>
          <ul className="f-cand__list">
            {NOT.map((n) => (
              <li className="f-cand__item f-cand__item--no" key={n}>
                <Cross />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
