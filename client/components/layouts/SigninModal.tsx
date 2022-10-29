import React, { useState } from 'react';

import Auth, { TabSelectionType } from '../auth/Auth';

const SignInModal = ({
  setShowSignInModal,
}: {
  setShowSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [tabSelection, setTabSelection] = useState<TabSelectionType>('signin');

  return (
    <div
      className="fixed w-screen h-screen bg-gray-600/80"
      onClick={() => setShowSignInModal(false)}
    >
      <div className="fixed w-screen h-screen flex justify-center items-center px-2 sm:px-16 md:px-32 lg:px-56 xl:px-96">
        <Auth tabSelection={tabSelection} setTabSelection={setTabSelection} />
      </div>
    </div>
  );
};

export default SignInModal;
