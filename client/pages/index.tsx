import React, { useContext, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Seo from '../components/layouts/Seo';

import hero from '../assets/images/background.png';
import logo from '../assets/images/logo.png';
import { AuthContext } from '../context/authContext';
import Auth, { TabSelectionType } from '../components/auth/Auth';

const Home: NextPage = () => {
  const [tabSelection, setTabSelection] = useState<TabSelectionType>('signin');
  const { state } = useContext(AuthContext);
  const router = useRouter();

  // Push the user to the dashboard if they exist in the state
  // This state was dispatched in Signin, Register, and AuthContext components
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
      <main className="">
        <div className="fixed h-screen w-screen top-0 -z-10 ">
          <Image
            alt="Hero"
            src={hero}
            layout="fill"
            objectFit="cover"
            quality={80}
            priority={true}
          />
        </div>

        <div className="flex justify-between container pt-10 pb-20 sm:pb-16 lg:pb-0 px-5 sm:px-10 xl:px-24 w-full">
          <div className="flex items-center">
            <div className="h-7 w-7 mr-2">
              <Image alt="Logo" src={logo} quality={80} priority={true} />
            </div>
            <h3 className="text-white">DevLink</h3>
          </div>
          <button className="btn btn-ghost px-3 py-2 text-xs sm:px-8 sm:py-3 sm:text-sm">
            View Developers
          </button>
        </div>

        <div className="container flex items-center justify-center w-full sm:h-screen mb-5 sm:mb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 justify-center md:items-center gap-20 px-5 sm:px-10 xl:px-24 md:-mt-24">
            <div className="col-span-1 ">
              <h1 className="mb-12 text-white">
                Welcome to DevLink, the social network built for developers
              </h1>
              <p className="mb-9 sm:mb-12 text-white">
                We strive to be the best and biggest social network for
                developers with users all around the world. Create your profile
                and chat with other developers to share your thoughts and
                expertise.
              </p>
              <button
                className="btn btn-ghost"
                onClick={() => setTabSelection('register')}
              >
                Register Now
              </button>
            </div>
            <Auth
              tabSelection={tabSelection}
              setTabSelection={setTabSelection}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
