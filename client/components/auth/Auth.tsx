import React, { useEffect, useState } from 'react';

import Signin from './Signin';
import Forgetpw from './Forgetpw';
import Register from './Register';

import SigninIcon from '../../assets/icons/login.svg';
import RegisterIcon from '../../assets/icons/user-plus.svg';

export type TabSelectionType = 'signin' | 'register' | 'forgetpw';

const Auth = ({ selectTab }: { selectTab?: TabSelectionType }) => {
  const [tabSelection, setTabSelection] = useState<TabSelectionType>('signin');

  useEffect(() => {
    selectTab && setTabSelection(selectTab);
  }, [selectTab]);

  return (
    <div className="grid grid-cols-12 grid-rows-3 gap-y-2 max-w-xl">
      {/* Sign In Tab */}
      <div
        className={`${
          tabSelection === 'signin' ? 'bg-secondary' : 'bg-gray-300'
        } flex justify-center items-center col-span-1 transition-colors row-span-1  py-5 rounded-tl-lg rounded-bl-lg p-2`}
      >
        <button
          className="flex items-center -rotate-90"
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
        } flex justify-center items-center col-span-1 transition-colors row-span-1 py-5 rounded-tl-lg rounded-bl-lg p-2`}
      >
        <button
          className="flex items-center -rotate-90"
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
