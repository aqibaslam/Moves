import type { Metadata } from 'next';
import {
  BOOKINGS_BY_DAY,
  CONSULTATIONS,
  ORDERS,
  gbp,
} from '../lib/demo-data';

export const metadata: Metadata = { title: 'Home' };

type Stat = {
  label: string;
  value: string;
  delta: number;
  note: string;
};

export default function DashboardHomePage() {
  const billable = ORDERS.filter((o) => o.status !== 'cancelled');
  const revenue = billable.reduce((sum, o) => sum + o.amountGbp, 0);
  const upcoming = CONSULTATIONS.filter((c) => c.status === 'upcoming').length;
  const completed = CONSULTATIONS.filter((c) => c.status === 'completed').length;

  // Guard the divide: an empty consultations list must not render "NaN%".
  const attended = completed + CONSULTATIONS.filter((c) => c.status === 'no_show').length;
  const showRate = attended === 0 ? 0 : Math.round((completed / attended) * 100);

  const stats: Stat[] = [
    { label: 'Revenue', value: gbp.format(revenue), delta: 12.4, note: 'vs last week' },
    { label: 'Orders', value: String(billable.length), delta: 8.1, note: 'vs last week' },
    { label: 'Upcoming consults', value: String(upcoming), delta: 4.6, note: 'next 7 days' },
    { label: 'Attendance', value: `${showRate}%`, delta: -2.3, note: 'vs last week' },
  ];

  const peak = Math.max(...BOOKINGS_BY_DAY.map((d) => d.count));

  // Revenue share by plan, largest first.
  const byPlan = [...billable
    .reduce((acc, o) => acc.set(o.plan, (acc.get(o.plan) ?? 0) + o.amountGbp), new Map<string, number>())
    .entries()]
    .sort((a, b) => b[1] - a[1]);

  return (
    <>
      <header className="dash__head">
        <div>
          <h1 className="dash__title">Good morning</h1>
          <p className="dash__sub">Here’s how the practice is tracking this week.</p>
        </div>
      </header>

      <section className="dash__stats" aria-label="Key metrics">
        {stats.map((s) => {
          const up = s.delta >= 0;
          return (
            <article className="dash__stat" key={s.label}>
              <p className="dash__statlabel">{s.label}</p>
              <p className="dash__statvalue">{s.value}</p>
              <p className={`dash__statdelta dash__statdelta--${up ? 'up' : 'down'}`}>
                {up ? '▲' : '▼'} {Math.abs(s.delta)}% <span>{s.note}</span>
              </p>
            </article>
          );
        })}
      </section>

      <div className="dash__grid2">
        <section className="dash__card" aria-label="Consultations booked by day">
          <div className="dash__cardhead">
            <h2 className="dash__cardtitle">Consultations booked</h2>
            <p className="dash__cardnote">Last 7 days</p>
          </div>
          <div className="dash__chart">
            {BOOKINGS_BY_DAY.map((d) => (
              <div className="dash__bar" key={d.day}>
                <span className="dash__barcount">{d.count}</span>
                {/* The visible number above each bar carries the value, so the
                    bar itself is decoration. */}
                <span className="dash__bartrack" aria-hidden="true">
                  <span
                    className="dash__barfill"
                    style={{ height: `${(d.count / peak) * 100}%` }}
                  />
                </span>
                <span className="dash__barday">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dash__card" aria-label="Revenue by plan">
          <div className="dash__cardhead">
            <h2 className="dash__cardtitle">Revenue by plan</h2>
          </div>
          <div className="dash__breakdown">
            {byPlan.map(([plan, amount]) => (
              <div className="dash__brow" key={plan}>
                <div className="dash__brtop">
                  <span className="dash__brname">{plan}</span>
                  <span className="dash__brval">{gbp.format(amount)}</span>
                </div>
                <div className="dash__track">
                  <div
                    className="dash__trackfill"
                    style={{ width: `${(amount / revenue) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
