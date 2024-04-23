'use client';

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';

//provide orgCode="organisation_id" if you have multiple
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
            Homepage
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            About
          </Link>

          {user && !isLoading && (
            <>
              <Link
                href="/income"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Income
              </Link>

              <Link
                href="/expense"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Expense
              </Link>
              <Link
                href="/savinggoal"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Saving Goals
              </Link>
              <Link
                href="/debt"
                className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Debt
              </Link>
              <LogoutLink className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Log out
              </LogoutLink>
            </>
          )}
          {!user && !isLoading && (
            <>
              <LoginLink className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Log In
              </LoginLink>
              <RegisterLink className="text-gray-300 hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                Register
              </RegisterLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
export default NavBar;
