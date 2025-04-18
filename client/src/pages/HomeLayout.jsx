import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
      {shouldShowNavbar && <Navbar />}

      <main className="p-4">
        <Outlet />
      </main>

      {shouldShowFooter && <Footer />}
    </>
  );
}

export default HomeLayout;
