import React, { useContext } from 'react';
import Image from 'next/image';

import { AuthContext } from '../../../context/authContext';

const Header = () => {
  const { state } = useContext(AuthContext);

  return (
    <>
      <div className="h-[22rem] w-full relative">
        <Image
          alt=""
          src={`https://via.placeholder.com/1280x352.png`}
          layout="fill"
          objectFit="cover"
          quality={80}
        />
      </div>
      <div className="grid grid-cols-10 w-full bg-gray-100">
        <div className="col-span-4">
          <ul className="flex">
            <li className="w-full h-28 flex items-center justify-center">
              <button className="font-bold" onClick={() => {}}>
                Feed
              </button>
            </li>
            <li className="w-full h-28 flex items-center justify-center">
              <button className="font-bold text-gray-400" onClick={() => {}}>
                Timeline
              </button>
            </li>
          </ul>
        </div>
        <div className="col-start-7 col-end-11">
          <ul className="flex">
            <li className="w-full h-28 flex items-center justify-center">
              <button className="font-bold text-gray-400" onClick={() => {}}>
                About
              </button>
            </li>
            <li className="w-full h-28 flex items-center justify-center">
              <button className="font-bold text-gray-400" onClick={() => {}}>
                Friends
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center">
        <div className="border-4 border-gray-100 rounded-full">
          <Image
            alt={state.user.name}
            src={state.user.avatar}
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>
        <h3>{state.user.name}</h3>
        {state.user.handle && (
          <div className="text-gray-400">{state.user.handle}</div>
        )}
      </div>
    </>
  );
};

export default Header;
