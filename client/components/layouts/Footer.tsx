import React from 'react';
import Image from 'next/image';

import logo from '../../assets/images/logo.png';
import background from '../../assets/images/background.png';
import FacebookIcon from '../../assets/icons/facebook.svg';
import InstagramIcon from '../../assets/icons/instagram.svg';
import TwitterIcon from '../../assets/icons/twitter.svg';

const Footer = () => {
  return (
    <footer className="h-72 relative -z-10">
      {/* Footer Background */}
      <div className="absolute top-0 left-0 bottom-0 right-0">
        <Image
          alt="Background"
          src={background}
          layout="fill"
          objectFit="cover"
          quality={80}
        />
      </div>

      {/* Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col justify-center items-center shadow-lg">
        <div className="flex items-center mb-5">
          <div className="h-7 w-7 mr-2">
            <Image alt="Logo" src={logo} quality={80} placeholder="blur" />
          </div>
          <h3 className="text-white">DevLink</h3>
        </div>
        <ul className="flex mb-5">
          <li className="mr-3">
            <button className="btn btn-text">Home</button>
          </li>
          <li className="mr-3">
            <button className="btn btn-text">About</button>
          </li>
          <li className="mr-3">
            <button className="btn btn-text">Contact Us</button>
          </li>
          <li>
            <button className="btn btn-text">Privacy</button>
          </li>
        </ul>
        <ul className="flex mb-5">
          <li className="mr-5">
            <button>
              <FacebookIcon className="w-5 h-5 fill-white hover:fill-secondary transition-colors duration-300" />
            </button>
          </li>
          <li className="mr-5">
            <button>
              <TwitterIcon className="w-5 h-5 fill-white hover:fill-secondary transition-colors duration-300" />
            </button>
          </li>
          <li>
            <button>
              <InstagramIcon className="w-5 h-5 fill-white hover:fill-secondary transition-colors duration-300" />
            </button>
          </li>
        </ul>
        <p className="text-gray-300 text-sm">
          © Copyright {new Date().getFullYear()}, DevLink Inc. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
