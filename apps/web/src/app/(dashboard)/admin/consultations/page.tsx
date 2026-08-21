import type { Metadata } from 'next';
import { StatusPill } from '../StatusPill';
import { CONSULTATION_STATUS_LABEL, listConsultations } from '../../lib/data';
import type { Consultation } from '@/payload-types';

export const metadata: Metadata = { title: 'Consultations' };

const TONE: Record<
  NonNullable<Consultation['status']>,
  'green' | 'blue' | 'amber' | 'grey' | 'coral'
> = {
  upcoming: 'blue',
  completed: 'green',
  no_show: 'coral',
  cancelled: 'grey',
};

const whenFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export default async function ConsultationsPage() {
  const consultations = await listConsultations();
  const upcoming = consultations.filter((c) => c.status === 'upcoming').length;

  return (
    <>
      <header className="dash__head">
        <div>
          <h1 className="dash__title">Consultations</h1>
          <p className="dash__sub">Every consultation booked through the site.</p>
        </div>
      </header>

      <section className="dash__card" aria-label="Consultations">
        <div className="dash__cardhead">
          <h2 className="dash__cardtitle">All consultations</h2>
          <p className="dash__cardnote">{upcoming} upcoming</p>
        </div>

        {consultations.length === 0 ? (
          <p className="dash__empty">
            No consultations yet. Bookings from the site will land here.
          </p>
        ) : (
          <div className="dash__tablewrap">
            <table className="dash__table">
              <thead>
                <tr>
                  <th scope="col">Patient</th>
                  <th scope="col">Email</th>
                  <th scope="col">When</th>
                  <th scope="col">Clinic</th>
                  <th scope="col">Dentist</th>
                  <th scope="col">Source</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c.id}>
                    <td className="dash__name">{c.patientName}</td>
                    <td className="dash__muted">{c.email}</td>
                    <td className="dash__when">{whenFmt.format(new Date(c.scheduledFor))}</td>
                    <td className="dash__muted">{c.clinic || '—'}</td>
                    <td className="dash__muted">{c.dentist || '—'}</td>
                    <td className="dash__muted">{c.source || '—'}</td>
                    <td>
                      <StatusPill tone={TONE[c.status]}>
                        {CONSULTATION_STATUS_LABEL[c.status]}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
