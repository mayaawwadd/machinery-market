import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function HomeLayout() {
  const location = useLocation();
  // Array of pages that should not include a footer
  const hideFooterRoutes = ['/login', '/register', '/dashboard'];
  // Boolean variable for the pages that should include a footer (check if the page is in HideFooterRoutes)
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />

      <main className="p-4">
        <Outlet />
      </main>

      {shouldShowFooter && <Footer />}
    </>
  );
}

export default HomeLayout;
