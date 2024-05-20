'use client';

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
import Link from 'next/link';

const NavBar = () => {
  const { user, isLoading } = useKindeBrowserClient();
  return (
    <header>
      <nav className="flex items-center justify-between bg-gray-800 p-6">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/"
            className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sākumlapa
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Par Mums
          </Link>

          {user && !isLoading && (
            <>
              <Link
                href="/income"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Ienākumi
              </Link>
              <Link
                href="/expense"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Izdevumi
              </Link>
              <Link
                href="/savinggoal"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Taupīšanas mērķi
              </Link>
              <Link
                href="/debt"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Parādi
              </Link>
              <Link
                href="/contactus"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sazinies
              </Link>
              <LogoutLink className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Atslēgties
              </LogoutLink>
            </>
          )}
          {!user && !isLoading && (
            <>
              <LoginLink className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Pieslēgties
              </LoginLink>
              <RegisterLink className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Reģistrēties
              </RegisterLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
export default NavBar;
