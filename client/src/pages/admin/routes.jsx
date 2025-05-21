import Overview from './Overview';
import Users from './Users';
import Machines from './Machines';
import Auctions from './Auctions';
import Transactions from './Transactions';
import Reviews from './Reviews';

export const adminRoutes = [
    { path: 'overview', label: 'Overview', element: <Overview /> },
    { path: 'users', label: 'Users', element: <Users /> },
    { path: 'machines', label: 'Machines', element: <Machines /> },
    { path: 'auctions', label: 'Auctions', element: <Auctions /> },
    { path: 'transactions', label: 'Transactions', element: <Transactions /> },
    { path: 'reviews', label: 'Reviews', element: <Reviews /> },
];
