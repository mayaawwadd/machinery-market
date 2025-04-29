import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import ThemedLayout from './ThemedLayout';

function HomeLayout() {
  const location = useLocation();
  // Array of pages that should not include a footer/navbar
  const hideNavbarRoutes = ['/login', '/register'];
  const hideFooterRoutes = ['/login', '/register', '/profile'];

  // Boolean variable for the pages that should include a footer/navbar
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <ThemedLayout>
        {shouldShowNavbar && <Navbar />}

        <main className="p-4">
          <Outlet />
        </main>

        {shouldShowFooter && <Footer />}
      </ThemedLayout>
    </>
  );
}

export default HomeLayout;
