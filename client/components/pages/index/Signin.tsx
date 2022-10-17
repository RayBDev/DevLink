import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLazyQuery, gql } from '@apollo/client';

import Spinner from '../../UI/Spinner';

// GQL Query
const LOGIN = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      email
      avatar
    }
  }
`;

const Signin = () => {
  const [login, { data, loading, error }] = useLazyQuery(LOGIN);

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '', rememberMe: true }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          login({ variables: { input: values } });
        }}
      >
        <Form>
          <Field
            name="email"
            type="email"
            placeholder="Email"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 active:bg-gray-100 focus:border-black mb-2"
          />
          <div className="text-xs text-red-600">
            <ErrorMessage name="email" />
          </div>

          <Field
            name="password"
            type="password"
            placeholder="Password"
            className="block w-full bg-gray-100 border-0 border-b-2 border-spacing-y-10 border-gray-300 px-2 py-4 placeholder-gray-400 focus:ring-0 focus:bg-gray-100 focus:border-black mb-6"
          />
          <div className="text-xs text-red-600">
            <ErrorMessage name="password" />
          </div>

          <label className="block mb-10">
            <Field
              name="rememberMe"
              type="checkbox"
              className="mr-2 border-2 border-gray-300 p-2 rounded-md focus:ring-0 focus:border-primary"
            ></Field>
            Remember me?
          </label>
          <div className="flex justify-between">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <button type="submit" className="btn btn-primary ">
                  Login
                </button>
                <button className="text-primary hover:text-secondary transition-colors text-sm">
                  Forgot your password?
                </button>
              </>
            )}
          </div>
          {error && (
            <div className="text-xs text-red-600">
              {error.graphQLErrors[0].message}
            </div>
          )}
        </Form>
      </Formik>
    </>
  );
};

export default Signin;
