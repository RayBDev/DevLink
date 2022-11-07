import React from 'react';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { GET_ALL_POSTS } from '../../../graphql/queries';
import LikeIcon from '../../../assets/icons/like.svg';
import CommentIcon from '../../../assets/icons/comments.svg';
import Spinner from '../../UI/Spinner';

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

  if (loading) return <Spinner />;
  if (error) return <div>Error retrieving posts</div>;

  const postNodes = posts!.allPosts.map((post, index) => {
    const likeNodes = post.likes?.map((like, index) => (
      <div
        className="relative rounded-full border-2 border-gray-100 w-7 h-7 -ml-3"
        key={`${like.name}${index}`}
      >
        <Image
          alt={like.name}
          src={like.avatar}
          width={27}
          height={27}
          className="rounded-full "
        />
      </div>
    ));

    return (
      <div
        className="w-full px-12 py-7 relative rounded-md bg-gray-100 mb-10"
        key={`${post.text}${index}`}
      >
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
        <p className="mb-5 pb-5 border-b border-gray-200">{post.text}</p>
        <div className="flex items-center">
          <div className="flex items-center mr-10">
            <LikeIcon className="fill-gray-500 mr-2 w-5 h-5" />
            <div className="text-gray-500 text-xs pt-1">
              {post.likes.length} Likes
            </div>
          </div>
          <div className="flex items-center">
            {likeNodes}
            <div className="text-xs text-gray-500 ml-2">
              {post.likes[1] &&
                `${post.likes[0].name}, ${post.likes[1].name} ${
                  post.likes.length > 2 && `and ${post.likes.length - 2} more`
                } liked this`}
              {post.likes[0] &&
                !post.likes[1] &&
                `${post.likes[0].name} liked this`}
            </div>
          </div>
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
