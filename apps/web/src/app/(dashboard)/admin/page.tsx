import type { Metadata } from 'next';
import { formatPence, listConsultations, listOrders, listProducts } from '../lib/data';

export const metadata: Metadata = { title: 'Home' };

/** Bookings grouped into the last 7 calendar days, oldest first. */
function bookingsByDay(dates: Date[]): { day: string; count: number }[] {
  const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const start = new Date(today);
    start.setDate(start.getDate() - (6 - i));
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return {
      day: fmt.format(start),
      count: dates.filter((d) => d >= start && d < end).length,
    };
  });
}

export default async function DashboardHomePage() {
  const [orders, consultations, products] = await Promise.all([
    listOrders(),
    listConsultations(),
    listProducts(),
  ]);

  const billable = orders.filter((o) => o.status !== 'cancelled');
  const revenue = billable.reduce((sum, o) => sum + o.amountPence, 0);
  const upcoming = consultations.filter((c) => c.status === 'upcoming').length;
  const completed = consultations.filter((c) => c.status === 'completed').length;
  const noShow = consultations.filter((c) => c.status === 'no_show').length;

  // Guard the divide: no attended consultations must not render "NaN%".
  const attended = completed + noShow;
  const showRate = attended === 0 ? null : Math.round((completed / attended) * 100);

  const stats = [
    { label: 'Revenue', value: formatPence(revenue), note: `${billable.length} active orders` },
    { label: 'Products', value: String(products.length), note: `${products.filter((p) => p.active).length} available` },
    { label: 'Upcoming consults', value: String(upcoming), note: 'not yet seen' },
    { label: 'Attendance', value: showRate === null ? '—' : `${showRate}%`, note: attended === 0 ? 'no data yet' : `${completed} of ${attended} attended` },
  ];

  const chart = bookingsByDay(consultations.map((c) => new Date(c.scheduledFor)));
  // Never divide by zero when every day is empty.
  const peak = Math.max(1, ...chart.map((d) => d.count));

  const byProduct = [...billable
    .reduce((acc, o) => {
      const name = typeof o.product === 'object' && o.product !== null ? o.product.name : 'Unknown';
      return acc.set(name, (acc.get(name) ?? 0) + o.amountPence);
    }, new Map<string, number>())
    .entries()]
    .sort((a, b) => b[1] - a[1]);

  const isEmpty = orders.length === 0 && consultations.length === 0 && products.length === 0;

  return (
    <>
      <header className="dash__head">
        <div>
          <h1 className="dash__title">Overview</h1>
          <p className="dash__sub">How the practice is tracking this week.</p>
        </div>
      </header>

      {isEmpty ? (
        <section className="dash__card">
          <p className="dash__empty">
            Nothing to show yet. Add your first product to get started — orders and consultations
            will populate these charts as they come in.
          </p>
        </section>
      ) : null}

      <section className="dash__stats" aria-label="Key metrics">
        {stats.map((s) => (
          <article className="dash__stat" key={s.label}>
            <p className="dash__statlabel">{s.label}</p>
            <p className="dash__statvalue">{s.value}</p>
            <p className="dash__statnote">{s.note}</p>
          </article>
        ))}
      </section>

      <div className="dash__grid2">
        <section className="dash__card" aria-label="Consultations booked by day">
          <div className="dash__cardhead">
            <h2 className="dash__cardtitle">Consultations booked</h2>
            <p className="dash__cardnote">Last 7 days</p>
          </div>
          <div className="dash__chart">
            {chart.map((d, i) => (
              <div className="dash__bar" key={`${d.day}-${i}`}>
                <span className="dash__barcount">{d.count}</span>
                {/* The visible number carries the value, so the bar is decoration. */}
                <span className="dash__bartrack" aria-hidden="true">
                  <span className="dash__barfill" style={{ height: `${(d.count / peak) * 100}%` }} />
                </span>
                <span className="dash__barday">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dash__card" aria-label="Revenue by product">
          <div className="dash__cardhead">
            <h2 className="dash__cardtitle">Revenue by product</h2>
          </div>
          {byProduct.length === 0 ? (
            <p className="dash__empty">No revenue recorded yet.</p>
          ) : (
            <div className="dash__breakdown">
              {byProduct.map(([name, amount]) => (
                <div className="dash__brow" key={name}>
                  <div className="dash__brtop">
                    <span className="dash__brname">{name}</span>
                    <span className="dash__brval">{formatPence(amount)}</span>
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
          )}
        </section>
      </div>
    </>
  );
}
