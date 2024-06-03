'use client';

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
import Link from 'next/link';
import { useState } from 'react';

const NavBar = () => {
  const { user, isLoading } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = useState(false);

  const dropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <nav className="flex items-center justify-between bg-gray-800 p-6">
        <div className="flex flex-row max-w-7xl mx-auto px-4">
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
              <div>
                <button
                  onClick={dropdown}
                  className={`font-normal outline-none hover:bg-gray-600 rounded-md p-2 text-sm w-[143px] [word-spacing:28px] ${
                    isOpen ? 'rounded-none bg-gray-600' : ''
                  }`}
                >
                  Finanses ∨
                </button>

                {isOpen && (
                  <ul className="flex flex-col absolute bg-slate-500 border border-gray-600 shadow-lg z-50">
                    <Link
                      href="/income"
                      className="text-gray-300 hover:bg-gray-600 px-3 py-2 text-sm font-medium"
                      onClick={dropdown}
                    >
                      Ienākumi
                    </Link>
                    <Link
                      href="/expense"
                      className="text-gray-300 hover:bg-gray-600 px-3 py-2 text-sm font-medium"
                      onClick={dropdown}
                    >
                      Izdevumi
                    </Link>
                    <Link
                      href="/savinggoal"
                      className="text-gray-300 hover:bg-gray-600 px-3 py-2 text-sm font-medium"
                      onClick={dropdown}
                    >
                      Taupīšanas mērķi
                    </Link>
                    <Link
                      href="/debt"
                      className="text-gray-300 hover:bg-gray-600 px-3 py-2 text-sm font-medium"
                      onClick={dropdown}
                    >
                      Parādi
                    </Link>
                  </ul>
                )}
              </div>
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
