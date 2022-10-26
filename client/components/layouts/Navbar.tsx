import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { AuthContext } from '../../context/authContext';
import logo from '../../assets/images/logo.png';
import SearchIcon from '../../assets/icons/search.svg';
import ChevronDownIcon from '../../assets/icons/cheveron-down.svg';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [showMobileLinks, setShowMobileLinks] = useState(false);
  const router = useRouter();

  const toggleMobileLinks = () => {
    setShowMobileLinks((prevState) => !prevState);
  };

  const logout = () => {
    Cookies.remove('checkToken', {
      path: '/',
      domain: process.env.NEXT_PUBLIC_DOMAIN_URL,
    });
    dispatch({ type: 'LOG_OUT_USER' });
    router.push('/');
  };

  return (
    <>
      {/* Mobile Navigation Menu */}
      <ul
        className={`transform-gpu transition-all duration-700 fixed top-16 right-0 bg-gray-100 md:hidden items-center w-full shadow-lg ${
          showMobileLinks ? 'translate-y-0' : '-translate-y-56'
        }`}
      >
        <li className={`px-3 pb-3 pt-5 md:p-2 border-b border-gray-200`}>
          <Link href="/developers" className="hover:text-secondary">
            Developers
          </Link>
        </li>
        {!state.user._id && (
          <>
            <li className={`px-3 pb-3 pt-5 md:p-2 border-b border-gray-200`}>
              <button className="hover:text-secondary">Login</button>
            </li>
            <li className={`p-3 md:p-2 border-b border-gray-200`}>
              <button className="hover:text-secondary">Register</button>
            </li>
          </>
        )}
        {state.user._id && (
          <>
            <li className={`p-3 md:p-2 border-b border-gray-200`}>
              <Link
                href={`/${
                  state.user.handle ? state.user.handle : state.user._id
                }/profile`}
                className="hover:text-secondary"
              >
                Profile Settings
              </Link>
            </li>
            <li className={`p-3 md:p-2 border-b border-gray-200`}>
              <button onClick={logout} className="hover:text-secondary">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/** Main Navigation Bar */}
      <nav className="fixed w-full py-2 md:py-5 px-5 md:px-20 flex justify-between items-center bg-primary shadow-sm">
        {/* Logo */}
        <div className="flex items-center mr-28">
          <div className="h-7 w-7 mr-2">
            <Image alt="Logo" src={logo} quality={80} placeholder="blur" />
          </div>
          <h3 className="text-white">DevLink</h3>
        </div>

        {/* Mobile Menu Icon*/}
        <div className="flex md:hidden ml-auto">
          <input
            type="checkbox"
            className={styles.navigation__checkbox}
            id="navi-toggle"
            defaultChecked={showMobileLinks}
          />
          <label
            onClick={toggleMobileLinks}
            className={styles.navigation__button}
          >
            <span className={styles.navigation__icon}>&nbsp;</span>
          </label>
        </div>

        {/* Search */}
        <div className="hidden md:flex">
          <div className="flex rounded-3xl bg-white items-center px-5 w-96 mr-4">
            <SearchIcon className="mr-3 w-6 h-6 fill-gray-400" />

            <input
              type="text"
              className="border-0 w-full focus:ring-0"
              placeholder="Search for other developers..."
              name="search"
            />
          </div>
          <button className="hover:text-secondary">Find Friends</button>
        </div>

        {/* User */}
        <div className="md:flex items-center ml-auto hidden">
          <Image
            alt={state.user.name}
            src={state.user.avatar}
            width={40}
            height={40}
            className="rounded-full"
          />

          <div className="flex flex-col mx-3">
            <p className="text-white text-sm font-bold">{state.user.name}</p>
            <p className="text-white text-xs">Developer Title</p>
          </div>
          <ChevronDownIcon className="fill-white" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
