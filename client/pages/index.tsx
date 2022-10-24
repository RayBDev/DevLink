import React, { useContext, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Seo from '../components/layouts/Seo';
import Signin from '../components/pages/index/Signin';
import Register from '../components/pages/index/Register';
import Forgetpw from '../components/pages/index/Forgetpw';

import hero from '../assets/images/background.png';
import logo from '../assets/images/logo.png';
import SigninIcon from '../assets/icons/login.svg';
import RegisterIcon from '../assets/icons/user-plus.svg';
import { AuthContext } from '../context/authContext';

export type TabSelectionType = 'signin' | 'register' | 'forgetpw';

const Home: NextPage = () => {
  const [tabSelection, setTabSelection] = useState<TabSelectionType>('signin');
  const { state } = useContext(AuthContext);
  const router = useRouter();

  if (state.user._id) {
    router.push(
      `/${state.user.handle ? state.user.handle : state.user._id}/dashboard`
    );
  }

  return (
    <div>
      <Seo
        pageTitle="DevLink"
        pageDescription="The largest social network for developers
              with users all around the world. Create your profile and chat with
              other developers to share your thoughts and expertise."
        disableTitleCompilation={true}
      />
      <main className="container flex items-center justify-center w-screen h-screen ">
        <div className="fixed h-screen w-screen overflow-hidden -z-10 ">
          <Image
            alt="Hero"
            src={hero}
            layout="fill"
            objectFit="cover"
            quality={80}
            priority={true}
          />
        </div>
        <div className="fixed top-8 left-0 w-screen">
          <div className="flex justify-between container px-24">
            <div className="flex items-center">
              <div className="h-7 w-7 mr-2">
                <Image alt="Logo" src={logo} quality={80} priority={true} />
              </div>
              <h3 className="text-white">DevLink</h3>
            </div>
            <button className="btn btn-ghost">View Developers</button>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-20 px-24 pt-20">
          <div className="col-span-1 ">
            <h1 className="mb-12 text-white">
              Welcome to DevLink, the social network built for developers
            </h1>
            <p className="mb-12 text-white">
              We strive to be the best and biggest social network for developers
              with users all around the world. Create your profile and chat with
              other developers to share your thoughts and expertise.
            </p>
            <button
              className="btn btn-ghost"
              onClick={() => setTabSelection('register')}
            >
              Register Now
            </button>
          </div>
          <div className="grid grid-cols-12 grid-rows-3 gap-y-2">
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
                <h4
                  className={`${tabSelection === 'signin' ? 'text-white' : ''}`}
                >
                  Signin
                </h4>
              </button>
            </div>

            {/* Content */}
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
                <h4
                  className={`${
                    tabSelection === 'register' ? 'text-white' : ''
                  }`}
                >
                  Register
                </h4>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
