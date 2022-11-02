import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, UserInputError } from 'apollo-server-core';
import { URLResolver, DateTimeResolver } from 'graphql-scalars';
import { Types } from 'mongoose';
import Validator from 'validator';

import { JWTPayloadType } from '../auth/authGen';
import { Post } from '../models/Post';
import { Profile } from '../models/Profile';

// @type    Query
// @desc    Get All posts
// @access  Public
const allPosts = async () => {
  // Find all posts in the database and sort them by date in descending order
  const posts = await Post.find().sort({ createdAt: -1 });

  // If no posts are found throw an error
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

// @type    Query
// @desc    Get post by id
// @access  Public
const postById = async (_: void, args: PostByIdArgs) => {
  // Search database for post based on post id
  const post = await Post.findById(args.input.post_id);

  // If no post is found throw an error
  if (!post) {
    throw new UserInputError('No post found with that ID');
  } else {
    return post;
  }
};

// Argument Types Received for PostById Query
type PostsByUserArgs = {
  input: { user_id: Types.ObjectId };
};

// @type    Query
// @desc    Get posts by user id
// @access  Public
const postsByUser = async (_: void, args: PostsByUserArgs) => {
  // Search database for post based on post id
  const post = await Post.find({ user: args.input.user_id }).sort({
    createdAt: -1,
  });

  // If no post is found throw an error
  if (!post) {
    throw new UserInputError('No post found for this user');
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

// @type    Mutation
// @desc    Create post
// @access  Private
const createPost = async (
  _: void,
  args: CreatePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  // Validate that the post text length is between 10 and 300 characters
  if (!Validator.isLength(args.input.text, { min: 10, max: 300 })) {
    throw new UserInputError('Post must be between 10 and 300 characters');
  }

  // Create a new post document
  const newPost = new Post({
    text: args.input.text,
    name: args.input.name,
    avatar: args.input.avatar,
    user: user._id,
  });

  // Save the post document and return new post
  return await newPost.save();
};

// Argument Types Received for DeletePost Mutation
type DeletePostArgs = {
  input: { post_id: Types.ObjectId };
};

// @type    Mutation
// @desc    Delete post
// @access  Private
const deletePost = async (
  _: void,
  args: DeletePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  // Find user's profile and post to be deted
  const profile = await Profile.findOne({ user: user._id });
  const post = await Post.findById(args.input.post_id);

  // Only allow post deletion if user profile and post exists
  if (post && profile) {
    // Check for post owner and throw error if user doesn't own the post
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

// @type    Mutation
// @desc    Like post
// @access  Private
const likePost = async (
  _: void,
  args: LikePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  // Find post and user profile
  const profile = await Profile.findOne({ user: user._id });
  const post = await Post.findById(args.input.post_id);

  // Only allow post like if post and profile exists
  if (post && profile && post.likes) {
    // Check if user has already liked the post by filtering through likes to see if user_id is found
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

// @type    Mutation
// @desc    Unlike post
// @access  Private
const unlikePost = async (
  _: void,
  args: UnlikePostArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  // Find post and user profile
  const profile = await Profile.findOne({ user: user._id });
  const post = await Post.findById(args.input.post_id);

  // Only allow unlike if post and profile exists
  if (post && profile && post.likes) {
    // Check if user has liked the post and if not, throw an error
    if (
      post.likes.filter((like) => like.user.toString() === user._id.toString())
        .length === 0
    ) {
      throw new UserInputError('You have not yet liked this post');
    }

    // Create new array with list of users and find the index of the logged in user
    const removeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(user._id.toString());

    // Splice the user out of the array using the index found above
    post.likes.splice(removeIndex, 1);

    // Return updated post
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

// @type    Mutation
// @desc    Add comment to post
// @access  Private
const commentOnPost = async (
  _: void,
  args: CommentOnPostArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  let { post_id, text, name, avatar } = args.input;

  // Check if the comment text is between 10 and 300 characters
  if (!Validator.isLength(text, { min: 10, max: 300 })) {
    throw new UserInputError('Post must be between 10 and 300 characters');
  }

  // Find the post that the user wants to comment on
  const post = await Post.findById(post_id);

  // Check if the post exists
  if (post && post.comments) {
    // Create a new comment object
    const newComment = {
      text,
      name,
      avatar,
      user: user._id,
    };

    // Add new comment to beginning of comments array
    post.comments.unshift(newComment);

    // Save the post with the new comment
    return post.save();
  } else {
    throw new UserInputError('No post found"');
  }
};

// Argument Types Received for DeleteComment Mutation
type DeleteCommentArgs = {
  input: { post_id: Types.ObjectId; comment_id: Types.ObjectId };
};

// @type    Mutation
// @desc    Remove comment from post
// @access  Private
const deleteComment = async (
  _: void,
  args: DeleteCommentArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  let { post_id, comment_id } = args.input;

  // Find the post the user wants to delete their comment from
  const post = await Post.findById(post_id);

  // Check if post exists
  if (post && post.comments) {
    // Check if the comment exists
    if (
      post.comments.filter(
        (postComment) => postComment._id!.toString() === comment_id.toString()
      ).length === 0
    ) {
      throw new UserInputError('Comment does not exist');
    }

    if (
      post.comments.filter(
        (postComment) =>
          postComment.user!.toString() === user._id.toString() &&
          postComment._id!.toString() === comment_id.toString()
      ).length === 0
    ) {
      throw new UserInputError('User can only delete their own comments');
    }

    // Create a comment id only array an find the index of the comment to be deleted
    const removeIndex = post.comments
      .map((comment) => comment._id!.toString())
      .indexOf(comment_id.toString());

    // Splice the comment found above out of the array
    post.comments.splice(removeIndex, 1);

    // Save the post and return the updated post
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
    postsByUser,
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
