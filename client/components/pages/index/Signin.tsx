import React, { SetStateAction, useContext, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLazyQuery } from '@apollo/client';

import Spinner from '../../UI/Spinner';
import { GET_HANDLE, LOGIN } from '../../../graphql/queries';
import { AuthContext } from '../../../context/authContext';
import { TabSelectionType } from '../../../pages';

type SetTabSelectionType = {
  setTabSelection: (value: SetStateAction<TabSelectionType>) => void;
};

const Signin = ({ setTabSelection }: SetTabSelectionType) => {
  const { dispatch } = useContext(AuthContext);
  const [login, { data: user, loading: loadingUser, error }] =
    useLazyQuery(LOGIN);
  const [
    getHandle,
    { data: profile, loading: loadingHandle, error: loadingHandleError },
  ] = useLazyQuery(GET_HANDLE);

  // When component mounts, monitor the fetched user data and dispatch those details when the submit button is clicked
  useEffect(() => {
    if (user && profile && !loadingUser && !loadingHandle) {
      dispatch({
        type: 'LOGGED_IN_USER',
        payload: {
          user: {
            _id: user.login._id,
            name: user.login.name,
            email: user.login.email,
            avatar: user.login.avatar,
            handle: profile.profile.handle,
          },
        },
      });
    } else if (user && loadingHandleError && !loadingUser && !loadingHandle) {
      dispatch({
        type: 'LOGGED_IN_USER',
        payload: {
          user: {
            _id: user.login._id,
            name: user.login.name,
            email: user.login.email,
            avatar: user.login.avatar,
          },
        },
      });
    }
  }, [user, profile, loadingUser, loadingUser]);

  return (
    <div className="col-span-11 row-span-3 bg-gray-100 rounded-tr-lg rounded-b-lg py-14 px-20">
      <h2 className="capitalize mb-5">Sign in to your account</h2>
      <span className="inline-block h-1 w-2 bg-primary rounded-sm mr-1">
        &#160;
      </span>
      <span className="inline-block h-1 w-5 bg-primary rounded-sm">&#160;</span>
      <h4 className="text-gray-500 my-5 font-medium">
        Login or create new account
      </h4>
      <Formik
        initialValues={{ email: '', password: '', rememberMe: true }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={async (values) => {
          // Run queries to get the user details and user handle
          await login({
            variables: {
              input: { email: values.email, password: values.password },
            },
          });
          await getHandle();
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

          <Field
            name="password"
            type="password"
            placeholder="Password"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 focus:bg-gray-100 focus:border-black mb-2"
          />
          <div className="text-xs text-red-600 px-2">
            <ErrorMessage name="password" />
          </div>

          <label className="block mt-6 mb-10">
            <Field
              name="rememberMe"
              type="checkbox"
              className="mr-2 border-2 border-gray-300 p-2 rounded-md focus:ring-0 focus:border-primary"
            ></Field>
            Remember me?
          </label>
          <div className="flex justify-between">
            {loadingUser || loadingHandle ? (
              <Spinner />
            ) : (
              <>
                <button type="submit" className="btn btn-primary ">
                  Sign In
                </button>
                <button
                  className="text-primary hover:text-secondary transition-colors text-sm"
                  onClick={() => setTabSelection('forgetpw')}
                >
                  Forgot your password?
                </button>
              </>
            )}
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

export default Signin;
