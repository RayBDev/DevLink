import React from 'react';

import Signin from './Signin';
import Forgetpw from './Forgetpw';
import Register from './Register';

import SigninIcon from '../../assets/icons/login.svg';
import RegisterIcon from '../../assets/icons/user-plus.svg';

export type TabSelectionType = 'signin' | 'register' | 'forgetpw';

type PropTypes = {
  tabSelection: TabSelectionType;
  setTabSelection: React.Dispatch<React.SetStateAction<TabSelectionType>>;
};

const Auth = ({ tabSelection, setTabSelection }: PropTypes) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-12 grid-flow-dense grid-rows-[repeat(12, minmax(0, 1fr))] md:grid-rows-3 gap-x-2 md:gap-x-0 md:gap-y-2 max-w-xl m-auto">
      {/* Sign In Tab */}
      <div
        className={`${
          tabSelection === 'signin' ? 'bg-secondary' : 'bg-gray-300'
        } flex justify-center items-center col-span-1 transition-colors row-span-1 md:py-5 rounded-t-lg md:rounded-tr-none md:rounded-tl-lg md:rounded-bl-lg p-2`}
      >
        <button
          className="flex items-center md:-rotate-90"
          onClick={() => setTabSelection('signin')}
        >
          <SigninIcon
            className={`${
              tabSelection === 'signin' ? 'fill-white' : ''
            } mr-2 w-5 h-5 transition-colors`}
          />
          <h4 className={`${tabSelection === 'signin' ? 'text-white' : ''}`}>
            Signin
          </h4>
        </button>
      </div>

      {/* Tab Content */}
      {tabSelection === 'signin' ? (
        <Signin setTabSelection={setTabSelection} />
      ) : tabSelection === 'register' ? (
        <Register />
      ) : (
        <Forgetpw setTabSelection={setTabSelection} />
      )}

      {/* Register Tab */}
      <div
        className={`${
          tabSelection === 'register' ? 'bg-secondary' : 'bg-gray-300'
        } flex justify-center items-center col-span-1 transition-colors row-span-1 md:py-5 rounded-t-lg md:rounded-tr-none md:rounded-tl-lg md:rounded-bl-lg p-2`}
      >
        <button
          className="flex items-center md:-rotate-90"
          onClick={() => setTabSelection('register')}
        >
          <RegisterIcon
            className={`${
              tabSelection === 'register' ? 'fill-white' : ''
            } mr-2 w-5 h-5 transition-colors `}
          />
          <h4 className={`${tabSelection === 'register' ? 'text-white' : ''}`}>
            Register
          </h4>
        </button>
      </div>
    </div>
  );
};

export default Auth;
