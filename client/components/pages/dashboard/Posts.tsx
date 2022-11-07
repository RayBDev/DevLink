import React from 'react';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { GET_ALL_POSTS } from '../../../graphql/queries';
import LikeIcon from '../../../assets/icons/like.svg';
import CommentIcon from '../../../assets/icons/comments.svg';
import Spinner from '../../UI/Spinner';
import { useRouter } from 'next/router';

type PostData = {
  allPosts: {
    user: string;
    text: string;
    name: string;
    avatar: string;
    likes: { user: string; name: string; avatar: string }[];
    comments: { user: string; text: string; name: string; avatar: string }[];
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const Posts = () => {
  const { data: posts, loading, error } = useQuery<PostData>(GET_ALL_POSTS);
  const router = useRouter();

  if (loading) return <Spinner />;
  if (error) return <div>Error retrieving posts</div>;

  const postNodes = posts!.allPosts.map((post, index) => {
    {
      /** User avatars who liked the post */
    }
    const likeNodes = post.likes?.map((like, index) => (
      <button
        className="relative rounded-full border-2 border-gray-100 w-7 h-7 -ml-3"
        key={`${like.name}${index}`}
        onClick={() => router.push(`/${like.user}`)}
      >
        <Image
          alt={like.name}
          src={like.avatar}
          width={27}
          height={27}
          className="rounded-full"
        />
      </button>
    ));

    return (
      <div
        className="w-full px-12 py-7 relative rounded-md bg-gray-100 mb-10"
        key={`${post.text}${index}`}
      >
        {/** Post Creator Avatar, name and time post was created */}
        <div className="flex items-center mb-5">
          <div className="rounded-full bg-gray-100 pt-1 mr-3">
            <Image
              alt={post.name}
              src={post.avatar}
              width={40}
              height={40}
              className="rounded-full "
            />
          </div>
          <div>
            <div className="font-bold">{post.name}</div>
            <div className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>

        {/** Post content */}
        <p className="mb-5 pb-5 border-b border-gray-200">{post.text}</p>

        <div className="flex items-center">
          {/** Total amount of likes */}
          <div className="flex items-center mr-10">
            <LikeIcon className="fill-gray-500 mr-2 w-5 h-5" />
            <div className="text-gray-500 text-xs pt-1">
              {post.likes.length} Likes
            </div>
          </div>

          {/** User avatar and details who liked the post */}
          <div className="flex items-center">
            {likeNodes}
            <div className="text-xs text-gray-500 ml-2">
              {/** Output sentence based on how many users liked the post and what the initial two likers names are */}

              {/** 2 users or more liked the post */}
              {post.likes[1] && (
                <>
                  <button
                    className="btn py-0 hover:text-secondary"
                    onClick={() => router.push(`/${post.likes[0].user}`)}
                  >
                    {post.likes[0].name.split(' ')[0]}
                  </button>
                  ,{' '}
                  <button
                    className="btn py-0 hover:text-secondary"
                    onClick={() => router.push(`/${post.likes[1].user}`)}
                  >
                    {post.likes[1].name.split(' ')[0]}
                  </button>
                  {post.likes.length > 2 && `and ${post.likes.length - 2} more`}{' '}
                  liked this
                </>
              )}

              {/** 1 User liked the post */}
              {post.likes[0] && !post.likes[1] && (
                <>
                  <button
                    className="btn py-0 hover:text-secondary"
                    onClick={() => router.push(`/${post.likes[0].user}`)}
                  >
                    {post.likes[0].name.split(' ')[0]}
                  </button>{' '}
                  liked this
                </>
              )}
            </div>
          </div>

          {/** Comment Count icon and number */}
          <div className="ml-auto">
            <div className="flex items-center">
              <CommentIcon className="fill-gray-500 mr-2 w-5 h-5" />
              <div className="text-gray-500 text-xs">
                {post.comments.length && `${post.comments.length} Comments`}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return <>{postNodes}</>;
};

export default Posts;
