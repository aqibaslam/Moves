import { redirect } from 'next/navigation';
import { MovesMark } from '../MovesMark';
import { getAdminUser } from '../lib/auth';
import { signOut } from '../login/actions';
import { ConsultIcon, HomeIcon, OrdersIcon, ProductsIcon } from './icons';
import { NavLink } from './NavLink';

/**
 * Never prerender an authenticated route. These pages must run their auth
 * check per request, and they read live rows from the database — neither is
 * safe to bake at build time.
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
            <NavLink href="/admin" label="Home">
              <HomeIcon />
            </NavLink>
            <NavLink href="/admin/products" label="Products">
              <ProductsIcon />
            </NavLink>
            <NavLink href="/admin/orders" label="Orders">
              <OrdersIcon />
            </NavLink>
            <NavLink href="/admin/consultations" label="Consultations">
              <ConsultIcon />
            </NavLink>
          </nav>

          <div className="dash__sidefoot">
            <div className="dash__who">
              <p className="dash__wholabel">Signed in</p>
              <p className="dash__whoemail">{user.name || user.email}</p>
            </div>
            <form action={signOut}>
              <button className="dash__signout" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="dash__main" id="main">
          {children}
        </main>
      </div>
    </div>
  );
}
