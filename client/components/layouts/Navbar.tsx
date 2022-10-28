import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { AuthContext } from '../../context/authContext';
import hero from '../../assets/images/background.png';
import logo from '../../assets/images/logo.png';
import SearchIcon from '../../assets/icons/search.svg';
import ChevronDownIcon from '../../assets/icons/cheveron-down.svg';
import styles from './Navbar.module.css';
import SigninModal from './SigninModal';

const Navbar = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [showMobileLinks, setShowMobileLinks] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSigninModal, setShowSignInModal] = useState(false);
  const router = useRouter();

  const toggleMobileLinks = () => {
    setShowSearchDropdown(false);
    setShowMobileLinks((prevState) => !prevState);
  };

  const toggleSearchDropdown = () => {
    setShowMobileLinks(false);
    setShowSearchDropdown((prevState) => !prevState);
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
      {/* Mobile Search Box Dropdown */}
      <div
        className={`fixed lg:hidden transform-gpu transition-all duration-700 top-16 left-0 w-full shadow-lg bg-white px-3 py-2 ${
          showSearchDropdown ? 'translate-y-0' : '-translate-y-20'
        }`}
      >
        <input
          type="text"
          className="border-0 w-full focus:ring-0"
          placeholder="Search for other developers..."
          name="search"
        />
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={`transform-gpu transition-all duration-700 fixed top-16 right-0 bg-gray-100 lg:hidden items-center w-full shadow-lg ${
          showMobileLinks ? 'translate-y-0' : '-translate-y-56'
        }`}
      >
        <li className={`px-3 pb-3 pt-5 lg:p-2 border-b border-gray-200`}>
          <Link href="/developers" className="hover:text-secondary">
            Developers
          </Link>
        </li>
        {!state.user._id && (
          <>
            <li className={`px-3 pb-3 pt-5 lg:p-2 border-b border-gray-200`}>
              <button
                className="hover:text-secondary"
                onClick={() => setShowSignInModal(true)}
              >
                Login
              </button>
            </li>
            <li className={`p-3 lg:p-2 border-b border-gray-200`}>
              <button className="hover:text-secondary">Register</button>
            </li>
          </>
        )}
        {state.user._id && (
          <>
            <li className={`p-3 lg:p-2 border-b border-gray-200`}>
              <Link
                href={`/${
                  state.user.handle ? state.user.handle : state.user._id
                }/profile`}
                className="hover:text-secondary"
              >
                Profile Settings
              </Link>
            </li>
            <li className={`p-3 lg:p-2 border-b border-gray-200`}>
              <button onClick={logout} className="hover:text-secondary">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Navigation Background */}
      <div className="fixed h-16 lg:h-[5.5rem] w-screen overflow-hidden">
        <Image
          alt="Hero"
          src={hero}
          layout="fill"
          objectFit="cover"
          quality={80}
        />
      </div>

      {/** Main Navigation Bar */}
      <nav className="fixed w-full py-2 lg:py-5 px-5 lg:px-10 xl:px-20 flex items-center bg-transparent shadow-lg">
        {/* Logo */}
        <div className="flex items-center mr-28">
          <div className="h-7 w-7 mr-2">
            <Image alt="Logo" src={logo} quality={80} placeholder="blur" />
          </div>
          <h3 className="text-white">DevLink</h3>
        </div>

        {/* Search */}
        <div className="hidden md:flex">
          <div className="flex rounded-3xl bg-white items-center px-5 w-80 lg:w-96 mr-4">
            <SearchIcon className="mr-3 w-6 h-6 fill-gray-400" />

            <input
              type="text"
              className="border-0 w-full focus:ring-0"
              placeholder="Search for other developers..."
              name="search"
            />
          </div>
          <button className="hover:text-secondary text-white">
            Find Friends
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="flex items-center lg:hidden ml-auto">
          <button
            className="bg-gray-100 rounded-full w-9 h-9 flex justify-center items-center mr-3 hover:fill-primary md:hidden"
            onClick={toggleSearchDropdown}
          >
            <SearchIcon className="w-6 h-6 hover:fill-primary" />
          </button>
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

        {/* Logged In User Menu */}
        {state.user._id && (
          <div className="lg:flex items-center ml-auto hidden">
            <Image
              alt={state.user.name}
              src={state.user.avatar}
              width={40}
              height={40}
              className="rounded-full"
            />

            <div className="flex flex-col mx-3">
              <p className="text-white text-sm font-bold">{state.user.name}</p>
              <p className="text-white text-xs">
                {state.user.handle ? state.user.handle : state.user._id}
              </p>
            </div>
            <ChevronDownIcon className="fill-white" />
          </div>
        )}

        {/* Logged Out Navigation Menu */}
        {!state.user._id && (
          <ul className="xl:flex items-center ml-auto hidden">
            <li className="mr-5">
              <button
                className="btn btn-ghost"
                onClick={() => setShowSignInModal(true)}
              >
                Login
              </button>
            </li>
            <li className="btn btn-ghost">
              <Link href="/developers" className="">
                Developers
              </Link>
            </li>
          </ul>
        )}
      </nav>
      {showSigninModal && (
        <SigninModal setShowSignInModal={setShowSignInModal} />
      )}
    </>
  );
};

export default Navbar;
