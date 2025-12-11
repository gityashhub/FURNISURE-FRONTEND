import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { isSignedIn, user, signOut } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', padding: '1rem', gap: '0.5rem' }}>
      {isSignedIn ? (
        <>
          <span className="flex items-center mr-2">{user?.fullName}</span>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
