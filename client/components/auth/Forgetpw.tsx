import React, { SetStateAction } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLazyQuery } from '@apollo/client';

import Spinner from '../UI/Spinner';
import { TabSelectionType } from './Auth';
import { FORGET_PW } from '../../graphql/queries';
import LeftArrowIcon from '../../assets/icons/arrow-left.svg';

type SetTabSelectionType = {
  setTabSelection: (value: SetStateAction<TabSelectionType>) => void;
};

const Forgetpw = ({ setTabSelection }: SetTabSelectionType) => {
  const [forgetpw, { data, loading, error }] = useLazyQuery(FORGET_PW);

  return (
    <div className="col-span-11 row-span-3 bg-gray-100 rounded-tr-lg rounded-b-lg py-14 px-20">
      <h2 className="capitalize mb-5">Reset Your Password</h2>
      <span className="inline-block h-1 w-2 bg-primary rounded-sm mr-1">
        &#160;
      </span>
      <span className="inline-block h-1 w-5 bg-primary rounded-sm">&#160;</span>
      <h4 className="text-gray-500 my-5 font-medium">
        Enter your email to get a reset link
      </h4>
      <Formik
        initialValues={{ email: '', password: '', rememberMe: true }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
        })}
        onSubmit={async (values) => {
          await forgetpw({
            variables: {
              input: { email: values.email },
            },
          });
        }}
      >
        <Form>
          <Field
            name="email"
            type="email"
            placeholder="Email"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 active:bg-gray-100 focus:border-black mb-2"
          />
          <div className="text-xs text-red-600 px-2">
            <ErrorMessage name="email" />
          </div>
          <div className="flex justify-between mt-10">
            {loading ? (
              <Spinner />
            ) : !data?.forgetpw?.result ? (
              <button type="submit" className="btn btn-primary ">
                Send reset email
              </button>
            ) : (
              <div>
                Please check your email. A reset email will be sent if your
                account exists.
              </div>
            )}
            <button
              className="text-primary hover:text-secondary transition-colors text-sm flex items-center"
              onClick={() => setTabSelection('signin')}
            >
              <LeftArrowIcon className="fill-current mr-1 w-4 h-4" />
              <span>Back To Signin</span>
            </button>
          </div>
          {error && (
            <div className="text-xs text-red-600 mt-6">
              {error.graphQLErrors[0]?.message}
              {error.networkError?.message}
            </div>
          )}
        </Form>
      </Formik>
    </div>
  );
};

export default Forgetpw;
