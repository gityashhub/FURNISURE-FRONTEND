import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = () => (
  <header style={{ display: 'flex', justifyContent: 'flex-end',marginBottom: '1rem', padding: '1rem' }}>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </header>
);

export default Header;
