import { redirect } from 'next/navigation';
import { MovesMark } from '../MovesMark';
import { getAdminUser } from '../lib/auth';
import { signOut } from '../login/actions';
import { ConsultIcon, HomeIcon, OrdersIcon } from './icons';
import { NavLink } from './NavLink';

/**
 * Never prerender an authenticated route. Without this the build can statically
 * bake these pages: at build time NODE_ENV is production and Supabase may be
 * unconfigured, so getAdminUser() short-circuits without touching cookies(),
 * Next sees no dynamic API, and it prerenders. The auth check must run per
 * request, not once at build.
 */
export const dynamic = 'force-dynamic';

/**
 * Authenticated shell. The proxy redirects signed-out visitors before they get
 * here; this check is the second line of defence, so a proxy matcher change can
 * never silently expose the dashboard.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getAdminUser();
  if (!user) redirect('/login');

  return (
    <div className="dash">
      <div className="dash__shell">
        <aside className="dash__sidebar">
          <div className="dash__brand">
            <MovesMark className="dash__mark" />
            <span className="dash__brandtext">
              MOVES
              <span className="dash__brandsub">Practice</span>
            </span>
          </div>

          <nav className="dash__nav" aria-label="Dashboard">
            <p className="dash__navlabel">Overview</p>
            <NavLink href="/dashboard" label="Home">
              <HomeIcon />
            </NavLink>
            <NavLink href="/dashboard/orders" label="Orders">
              <OrdersIcon />
            </NavLink>
            <NavLink href="/dashboard/consultations" label="Consultations">
              <ConsultIcon />
            </NavLink>
          </nav>

          <div className="dash__sidefoot">
            <div className="dash__who">
              <p className="dash__wholabel">Signed in</p>
              <p className="dash__whoemail">{user.email}</p>
            </div>
            <form action={signOut}>
              <button className="dash__signout" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="dash__main" id="main">
          {user.preview ? (
            <p className="dash__banner">
              <strong>Preview mode.</strong> Supabase isn’t configured, so this is placeholder
              data behind a local password — not real sign-in and not real records.
            </p>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
