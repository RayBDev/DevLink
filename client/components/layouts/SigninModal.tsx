import React, { useState } from 'react';

import Auth, { TabSelectionType } from '../auth/Auth';

const SignInModal = ({
  setShowSignInModal,
}: {
  setShowSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [tabSelection, setTabSelection] = useState<TabSelectionType>('signin');

  return (
    <>
      <div
        className="fixed w-screen h-screen bg-gray-600/80 z-[60]"
        onClick={() => setShowSignInModal(false)}
      />
      <div className="fixed top-1/2 sm:left-1/2 w-screen lg:w-fit sm:-translate-x-1/2 -translate-y-1/2 px-5 z-[70]">
        <Auth tabSelection={tabSelection} setTabSelection={setTabSelection} />
      </div>
    </>
  );
};

export default SignInModal;
