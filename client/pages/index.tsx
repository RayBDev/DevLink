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
          <Auth selectTab={tabSelection} />
        </div>
      </main>
    </div>
  );
};

export default Home;
