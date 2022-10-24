import React, { useContext } from 'react';
import Image from 'next/image';

import { AuthContext } from '../../context/authContext';
import logo from '../../assets/images/logo.png';
import SearchIcon from '../../assets/icons/search.svg';
import ChevronDownIcon from '../../assets/icons/cheveron-down.svg';

const Navbar = () => {
  const { state } = useContext(AuthContext);

  return (
    <nav className="fixed w-full py-5 px-20 flex items-center bg-primary shadow-sm">
      {/* Logo */}
      <div className="flex items-center mr-28">
        <div className="h-7 w-7 mr-2">
          <Image alt="Logo" src={logo} quality={80} placeholder="blur" />
        </div>
        <h3 className="text-white">DevLink</h3>
      </div>

      {/* Search */}
      <div className="flex rounded-3xl bg-white items-center px-5 w-96 mr-4">
        <SearchIcon className="mr-3 w-6 h-6 fill-gray-400" />

        <input
          type="text"
          className="border-0 w-full focus:ring-0"
          placeholder="Search for other developers..."
          name="search"
        />
      </div>
      <button className="text-sm font-bold text-white transition-colors duration-300 font-sans hover:text-secondary">
        Find Friends
      </button>

      {/* User */}
      <div className="flex items-center ml-auto">
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
  );
};

export default Navbar;
