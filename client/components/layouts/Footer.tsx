import React from 'react';
import Image from 'next/image';

import logo from '../../assets/images/logo.png';
import FacebookIcon from '../../assets/icons/facebook.svg';
import InstagramIcon from '../../assets/icons/instagram.svg';
import TwitterIcon from '../../assets/icons/twitter.svg';

const Footer = () => {
  return (
    <footer className="w-full bg-primary py-20 flex flex-col justify-center items-center">
      {/* Logo */}
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
        © Copyright {new Date().getFullYear}, DevLink Inc. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
