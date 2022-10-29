import React, { useContext, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Spinner from '../UI/Spinner';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../graphql/mutations';
import { AuthContext } from '../../context/authContext';

const Register = () => {
  const { dispatch } = useContext(AuthContext);
  const [register, { data: user, loading: loadingUser, error }] =
    useMutation(REGISTER);

  // When component mounts, monitor the fetched user data and dispatch those details when the submit button is clicked
  useEffect(() => {
    if (user && !loadingUser) {
      dispatch({
        type: 'LOG_IN_USER',
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
  }, [user, loadingUser]);

  return (
    <div className="col-span-2 md:col-span-11 row-span-11 md:row-span-3 bg-gray-100 md:rounded-tr-lg rounded-b-lg py-14 px-5 sm:px-20">
      <h2 className="capitalize mb-5">Create your new account'</h2>
      <span className="inline-block h-1 w-2 bg-primary rounded-sm mr-1">
        &#160;
      </span>
      <span className="inline-block h-1 w-5 bg-primary rounded-sm">&#160;</span>
      <h4 className="text-gray-500 my-5 font-medium">
        User registration is now open!
      </h4>

      {/* Yup validation for name length, email, password complexity, and whether password2 = password */}
      <Formik
        initialValues={{ name: '', email: '', password: '', password2: '' }}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(2, 'Name must be a minimum of 2 characters')
            .max(30, 'Name must be a maximum of 30 characters')
            .required('Your name is required'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Your email is required'),
          password: Yup.string()
            .min(8, 'Password must between 8 and 32 characters')
            .max(32, 'Password must between 8 and 32 characters')
            .lowercase('Password must contain at least one lower case letter')
            .uppercase('Password must contain at least one upper case letter')
            .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
            .matches(
              /(?=.*[*.!@$%^&(){}[\]:;<>,\\\?\/~_\+\-=\|])/,
              'Password must contain at least one special character'
            )
            .required('A password is required'),
          password2: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords don't match")
            .min(8, "Passwords don't match")
            .max(32, "Passwords don't match")
            .lowercase("Passwords don't match")
            .uppercase("Passwords don't match")
            .matches(/(?=.*[0-9])/, "Passwords don't match")
            .matches(
              /(?=.*[*.!@$%^&(){}[\]:;<>,\\\?\/~_\+\-=\|])/,
              "Passwords don't match"
            )
            .required('Confirm Password is required'),
        })}
        onSubmit={async (values) => {
          await register({
            variables: {
              input: {
                name: values.name,
                email: values.email,
                password: values.password,
                password2: values.password2,
              },
            },
          });
        }}
      >
        <Form>
          <Field
            name="name"
            type="text"
            placeholder="Name*"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 active:bg-gray-100 focus:border-black mb-2"
          />
          <div className="text-xs text-red-600 px-2">
            <ErrorMessage name="name" />
          </div>

          <Field
            name="email"
            type="email"
            placeholder="Email*"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 active:bg-gray-100 focus:border-black mb-2"
          />
          <div className="text-xs text-red-600 px-2">
            <ErrorMessage name="email" />
          </div>

          <Field
            name="password"
            type="password"
            placeholder="Password*"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 focus:bg-gray-100 focus:border-black mb-2"
          />
          <div className="text-xs text-red-600 px-2">
            <ErrorMessage name="password" />
          </div>

          <Field
            name="password2"
            type="password"
            placeholder="Confirm Password*"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 focus:bg-gray-100 focus:border-black mb-2"
          />
          <div className="text-xs text-red-600 px-2">
            <ErrorMessage name="password2" />
          </div>

          {loadingUser ? (
            <Spinner />
          ) : (
            <>
              <button type="submit" className="btn btn-primary mt-10">
                Register New Account
              </button>
            </>
          )}

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

export default Register;
