import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { AuthContext } from '../../context/authContext';
import hero from '../../assets/images/background.png';
import logo from '../../assets/images/logo.png';
import SearchIcon from '../../assets/icons/search.svg';
import LogoutIcon from '../../assets/icons/logout.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import ChevronDownIcon from '../../assets/icons/cheveron-down.svg';
import UsersIcon from '../../assets/icons/group.svg';
import LoginIcon from '../../assets/icons/login.svg';
import RegisterIcon from '../../assets/icons/user-plus.svg';
import styles from './Navbar.module.css';
import SigninModal from './SigninModal';

const Navbar = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [showMobileLinks, setShowMobileLinks] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSigninModal, setShowSignInModal] = useState(false);
  const [showUserMenuDropdown, setShowUserMenuDropdown] = useState(false);
  const router = useRouter();

  const toggleMobileLinks = () => {
    setShowSearchDropdown(false);
    setShowUserMenuDropdown(false);
    setShowMobileLinks((prevState) => !prevState);
  };

  const toggleSearchDropdown = () => {
    setShowMobileLinks(false);
    setShowUserMenuDropdown(false);
    setShowSearchDropdown((prevState) => !prevState);
  };

  const toggleUserMenuDropdown = () => {
    setShowSearchDropdown(false);
    setShowMobileLinks(false);
    setShowUserMenuDropdown((prevState) => !prevState);
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
        className={`fixed lg:hidden transform-gpu transition-all duration-700 top-16 sm:top-[5.5rem] left-0 w-full shadow-lg bg-white px-3 py-2 z-10 ${
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
        className={`transform-gpu transition-all duration-700 fixed top-16 sm:top-24 right-0 bg-gray-100 xl:hidden items-center w-full shadow-lg z-20 ${
          showMobileLinks ? 'translate-y-0' : '-translate-y-56'
        }`}
      >
        <li className="border-b border-gray-200 px-5 py-3 text-xs">
          Devlink Menu
        </li>
        <li className={`px-5 py-5 flex items-center`}>
          <UsersIcon className="mr-3 fill-gray-400" />
          <Link href="/developers">
            <button className="hover:text-secondary text-sm">Developers</button>
          </Link>
        </li>
        {!state.user._id && (
          <>
            <li className={`px-5 pb-5 flex items-center`}>
              <LoginIcon className="mr-3 fill-gray-400" />
              <button
                className="hover:text-secondary text-sm"
                onClick={() => setShowSignInModal(true)}
              >
                Login
              </button>
            </li>
            <li className={`px-5 pb-5 flex items-center`}>
              <RegisterIcon className="mr-3 fill-gray-400" />
              <button className="hover:text-secondary text-sm">Register</button>
            </li>
          </>
        )}
        {state.user._id && (
          <>
            <li className={`px-5 pb-5 flex items-center`}>
              <SettingsIcon className="mr-3 fill-gray-400" />
              <Link
                href={`/${
                  state.user.handle ? state.user.handle : state.user._id
                }/profile`}
              >
                <button className="hover:text-secondary text-sm">
                  Profile Settings
                </button>
              </Link>
            </li>
            <li className={`px-5 pb-5 flex items-center`}>
              <LogoutIcon className="mr-3 fill-gray-400" />
              <button onClick={logout} className="hover:text-secondary text-sm">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Navigation Background */}
      <div className="fixed h-16 sm:h-[5.5rem] w-screen overflow-hidden z-30">
        <Image alt="" src={hero} layout="fill" objectFit="cover" quality={80} />
      </div>

      {/** Main Navigation Bar */}
      <nav
        className={`fixed w-full py-2 sm:py-5 px-5 lg:px-10 xl:px-20 flex items-center bg-transparent z-40 ${
          !showMobileLinks && 'shadow-lg'
        }`}
      >
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

        <div
          className={`flex items-center ml-auto ${
            !state.user._id ? 'xl:hidden' : 'lg:hidden'
          }`}
        >
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
          <div className="lg:flex items-center ml-auto hidden py-1">
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
            <button onClick={toggleUserMenuDropdown}>
              <ChevronDownIcon className="fill-white" />
            </button>
            <ul
              className={`transform-gpu transition-all duration-700 fixed top-[4.5rem] lg:right-10 xl:right-20 bg-gray-100 shadow-lg rounded-md w-64 z-50 ${
                showUserMenuDropdown ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <li className="border-b border-gray-200 px-5 py-2 text-xs">
                Your Account
              </li>
              <li className={`px-5 py-5 flex items-center`}>
                <SettingsIcon className="mr-3 fill-gray-400" />
                <Link
                  href={`/${
                    state.user.handle ? state.user.handle : state.user._id
                  }/profile`}
                  className="hover:text-secondary"
                >
                  <button className="text-sm hover:text-secondary">
                    Profile Settings
                  </button>
                </Link>
              </li>
              <li className={`px-5 pb-5 flex items-center`}>
                <LogoutIcon className="mr-3 fill-gray-400" />
                <button
                  onClick={logout}
                  className="hover:text-secondary text-sm"
                >
                  Logout
                </button>
              </li>
            </ul>
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
            <li>
              <Link href="/developers">
                <button className="btn btn-ghost">Developers</button>
              </Link>
            </li>
          </ul>
        )}
      </nav>
      {showSigninModal && !state.user._id && (
        <SigninModal setShowSignInModal={setShowSignInModal} />
      )}
    </>
  );
};

export default Navbar;
