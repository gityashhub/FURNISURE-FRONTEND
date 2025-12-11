import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { syncUserToBackend } from '../services/syncUser';

const Layout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const { user,isSignedIn  } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const sendUser = async () => {
      console.log('====================================');
      console.log("senduser called");
      console.log('====================================');
      const token = await getToken();
      await syncUserToBackend(user, token);
      sessionStorage.setItem(`userSynced-${user.id}`, "true");
    };
  
    const alreadySynced = sessionStorage.getItem(`userSynced-${user?.id}`) === "true";
  
    console.log('====================================');
    console.log("useeffect called", alreadySynced);
    console.log('====================================');
    if (isSignedIn && user && !alreadySynced) {

      console.log('==user info ==================================');
      console.log(user);
      console.log('====================================');
      sendUser();
    }
  }, [isSignedIn, user]);
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default Layout;
