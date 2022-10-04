import { IResolvers } from '@graphql-tools/utils';
import { UserInputError } from 'apollo-server-core';
import { URLResolver } from 'graphql-scalars';

import { JWTPayloadType } from '../auth/authGen';

// @desc    Get All posts
// @access  Public
const allPosts = () => {};

// Argument Types Received for PostById Query
type PostByIdArgs = {
  input: { handle: string };
};

// @desc    Get post by id
// @access  Public
const postById = (_: void, args: PostByIdArgs) => {};

// Argument Types Received for CreatePost Mutation
type CreatePostArgs = {
  input: { handle: string };
};

// @desc    Create post
// @access  Private
const createPost = (
  _: void,
  args: CreatePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');
};

// Argument Types Received for DeletePost Mutation
type DeletePostArgs = {
  input: { handle: string };
};

// @desc    Delete post
// @access  Private
const deletePost = (
  _: void,
  args: DeletePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');
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
  URL: URLResolver,
  Query: {
    allPosts,
  },
  Mutation: {},
};

module.exports = resolverMap;
