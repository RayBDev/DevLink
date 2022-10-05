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
  if (!user) throw new AuthenticationError('User not logged in');

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
  if (!user) throw new AuthenticationError('User not logged in');

  const profile = await Profile.findOne({ user: user._id });
  const post = await Post.findById(args.input.post_id);

  if (post && profile) {
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
  input: { post_id: Types.ObjectId };
};

// @desc    Like post
// @access  Private
const likePost = async (
  _: void,
  args: LikePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  const profile = await Profile.findOne({ user: user._id });
  const post = await Post.findById(args.input.post_id);

  if (post && profile && post.likes) {
    if (
      post.likes.filter((like) => like.user.toString() === user._id.toString())
        .length > 0
    ) {
      throw new UserInputError('User already liked this post');
    }

    // Add user id to likes array
    post.likes.unshift({ user: user._id });

    return post.save();
  } else {
    throw new UserInputError('Post not found');
  }
};

// Argument Types Received for UnlikePost Mutation
type UnlikePostArgs = {
  input: { post_id: Types.ObjectId };
};

// @desc    Unlike post
// @access  Private
const unlikePost = async (
  _: void,
  args: UnlikePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  const profile = await Profile.findOne({ user: user._id });
  const post = await Post.findById(args.input.post_id);

  if (post && profile && post.likes) {
    if (
      post.likes.filter((like) => like.user.toString() === user._id.toString())
        .length === 0
    ) {
      throw new UserInputError('You have not yet liked this post');
    }

    // Get remove index
    const removeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(user._id.toString());

    // Splice out of array
    post.likes.splice(removeIndex, 1);

    return post.save();
  } else {
    throw new UserInputError('Post not found');
  }
};

// Argument Types Received for CommentOnPost Mutation
type CommentOnPostArgs = {
  input: {
    post_id: Types.ObjectId;
    text: string;
    name?: string;
    avatar?: string;
  };
};

// @desc    Add comment to post
// @access  Private
const commentOnPost = async (
  _: void,
  args: CommentOnPostArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  let { post_id, text, name, avatar } = args.input;

  if (!Validator.isLength(text, { min: 10, max: 300 })) {
    throw new UserInputError('Post must be between 10 and 300 characters');
  }

  const post = await Post.findById(post_id);

  if (post && post.comments) {
    const newComment = {
      text,
      name,
      avatar,
      user: user._id,
    };

    // Add to comments array
    post.comments.unshift(newComment);

    // Save
    return post.save();
  } else {
    throw new UserInputError('No post found"');
  }
};

// Argument Types Received for DeleteComment Mutation
type DeleteCommentArgs = {
  input: { post_id: Types.ObjectId; comment_id: Types.ObjectId };
};

// @desc    Remove comment from post
// @access  Private
const deleteComment = async (
  _: void,
  args: DeleteCommentArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  let { post_id, comment_id } = args.input;

  const post = await Post.findById(post_id);

  if (post && post.comments) {
    if (
      post.comments.filter(
        (postComment) => postComment._id!.toString() === comment_id.toString()
      ).length === 0
    ) {
      throw new UserInputError('Comment does not exist');
    }

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment._id!.toString())
      .indexOf(comment_id.toString());

    // Splice comment out of array
    post.comments.splice(removeIndex, 1);

    return post.save();
  } else {
    throw new UserInputError('Post or comment not found');
  }
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
    likePost,
    unlikePost,
    commentOnPost,
    deleteComment,
  },
};

module.exports = resolverMap;
