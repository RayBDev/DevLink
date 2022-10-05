import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-core';
import { URLResolver, DateTimeResolver } from 'graphql-scalars';
import { Types } from 'mongoose';
import Validator from 'validator';

import { JWTPayloadType } from '../auth/authGen';
import { Post } from '../models/Post';
import { Profile } from '../models/Profile';

// @desc    Get All posts
// @access  Public
const allPosts = async () => {
  const posts = await Post.find().sort({ date: -1 });

  if (posts.length < 1) {
    throw new UserInputError('No posts found');
  } else {
    return posts;
  }
};

// Argument Types Received for PostById Query
type PostByIdArgs = {
  input: { post_id: Types.ObjectId };
};

// @desc    Get post by id
// @access  Public
const postById = async (_: void, args: PostByIdArgs) => {
  const post = await Post.findById(args.input.post_id);

  if (!post) {
    throw new UserInputError('No post found with that ID');
  } else {
    return post;
  }
};

// Argument Types Received for CreatePost Mutation
type CreatePostArgs = {
  input: {
    user: Types.ObjectId;
    text: string;
    name?: string;
    avatar?: string;
  };
};

// @desc    Create post
// @access  Private
const createPost = async (
  _: void,
  args: CreatePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');

  if (!Validator.isLength(args.input.text, { min: 10, max: 300 })) {
    throw new UserInputError('Post must be between 10 and 300 characters');
  }

  const newPost = new Post({
    text: args.input.text,
    name: args.input.name,
    avatar: args.input.avatar,
    user: user._id,
  });

  return await newPost.save();
};

// Argument Types Received for DeletePost Mutation
type DeletePostArgs = {
  input: { post_id: Types.ObjectId };
};

// @desc    Delete post
// @access  Private
const deletePost = async (
  _: void,
  args: DeletePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');

  const post = await Post.findById(args.input.post_id);

  if (post) {
    // Check for post owner
    if (post.user.toString() !== user._id.toString()) {
      throw new AuthenticationError('User not authorized');
    }

    await post.remove();
    return { result: 'success' };
  } else {
    throw new UserInputError('Post not found');
  }
};

// Argument Types Received for LikePost Mutation
type LikePostArgs = {
  input: { handle: string };
};

// @desc    Like post
// @access  Private
const likePost = (
  _: void,
  args: LikePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');
};

// Argument Types Received for UnlikePost Mutation
type UnlikePostArgs = {
  input: { handle: string };
};

// @desc    Unlike post
// @access  Private
const unlikePost = (
  _: void,
  args: UnlikePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');
};

// Argument Types Received for CommentOnPost Mutation
type CommentOnPostArgs = {
  input: { handle: string };
};

// @desc    Add comment to post
// @access  Private
const commentOnPost = (
  _: void,
  args: CommentOnPostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');
};

// Argument Types Received for DeleteComment Mutation
type DeleteCommentArgs = {
  input: { handle: string };
};

// @desc    Remove comment from post
// @access  Private
const deleteComment = (
  _: void,
  args: DeleteCommentArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');
};

const resolverMap: IResolvers = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  Query: {
    allPosts,
    postById,
  },
  Mutation: {
    createPost,
    deletePost,
  },
};

module.exports = resolverMap;
