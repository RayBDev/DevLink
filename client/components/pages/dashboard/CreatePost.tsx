import React, { useContext } from 'react';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { AuthContext } from '../../../context/authContext';
import WriteIcon from '../../../assets/icons/write.svg';
import { CREATE_POST } from '../../../graphql/mutations';
import Spinner from '../../UI/Spinner';
import { GET_POSTS_BY_USER } from '../../../graphql/queries';

const CreatePost = () => {
  const { state } = useContext(AuthContext);

  type PostsByUser = {
    postsByUser: {
      user: string;
      text: string;
      name: string;
      avatar: string;
      likes: {
        user: string;
      };
      comments: {
        user: string;
        text: string;
        name: string;
        avatar: string;
      };
      createdAt: string;
      updatedAt: string;
    }[];
  };

  const [createPost, { loading: loadingPost, error: postError }] = useMutation(
    CREATE_POST,
    {
      // update cache
      update: (cache, { data: { createPost } }) => {
        // Read current data from the cache
        const data: PostsByUser | null = cache.readQuery({
          query: GET_POSTS_BY_USER,
        });

        // Write data to the cache using the mutation result and the current cached data. The query argument is to determine the shape of the cache
        if (data && data.postsByUser) {
          // write Query to cache
          cache.writeQuery({
            query: GET_POSTS_BY_USER,
            data: {
              postsByUser: [createPost, ...data.postsByUser],
            },
          });
        }
      },
    }
  );

  return (
    <div className="w-full px-12 py-5 relative rounded-md bg-gray-100 mb-10">
      <label
        htmlFor="createPost"
        className="flex items-center mt-2 mb-4 font-bold font-heading cursor-pointer"
      >
        <WriteIcon className="mr-3" />
        <div className="text-gray-500">Create Post</div>
      </label>

      <Formik
        initialValues={{ post: '' }}
        validationSchema={Yup.object({
          post: Yup.string()
            .min(10, 'Post must be a minimum of 10 characters')
            .max(300, 'Post cannot exceed 300 characters')
            .required('Please enter your post details above'),
        })}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createPost({
              variables: {
                input: {
                  user: state.user._id,
                  text: values.post,
                  name: state.user.name,
                  avatar: state.user.avatar,
                },
              },
            });
            resetForm();
            toast.success('Post created successfully');
          } catch {
            if (postError) toast.error(postError.graphQLErrors[0]?.message);
          }
        }}
      >
        <Form>
          <div className="rounded md border border-gray-300 flex p-5 mb-5">
            <div className="rounded-full bg-gray-100 pt-1">
              <Image
                alt={state.user.name}
                src={state.user.avatar}
                width={30}
                height={30}
                className="rounded-full "
              />
            </div>
            <Field
              name="post"
              as="textarea"
              placeholder="What's on your mind?"
              rows={4}
              className="w-full border-none bg-gray-100 resize-none focus:ring-0"
            />
          </div>
          <div className="text-xs text-red-600 px-2">
            <ErrorMessage name="post" />
          </div>

          <div className="text-right">
            {loadingPost ? (
              <Spinner />
            ) : (
              <button className="btn btn-primary" type="submit">
                Create Post
              </button>
            )}
          </div>

          {postError && (
            <div className="text-xs text-red-600 mt-6">
              {postError.networkError?.message}
            </div>
          )}
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
