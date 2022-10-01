import { IResolvers } from '@graphql-tools/utils';
import { UserInputError } from 'apollo-server-core';
import { Response } from 'express';
import { DateTimeResolver, URLResolver } from 'graphql-scalars';
import { ObjectId, Types } from 'mongoose';
import { JWTPayloadType } from '../auth/authGen';

import { Profile } from '../models/Profile';

// Validation Imports
import { validateProfileInput } from '../validation/profile';

// @desc    Get current users profile
// @access  Private
const profile = async (
  _: void,
  args: any,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');

  try {
    const profile = await Profile.findOne({ user: user._id }).populate('user', [
      'name',
      'avatar',
    ]);
    return profile;
  } catch (err) {
    throw new UserInputError('There is no profile for this user');
  }
};

// @desc    Get all profiles
// @access  Public
const allProfiles = (_: void, args: any) => {};

// @desc    Get profile by handle
// @access  Public
const profileByHandle = (_: void, args: any) => {};

// @desc    Get profile by user ID
// @access  Public
const profileById = (_: void, args: any) => {};

// Argument Types Received for Edit Profile Mutation
export type EditProfileArgs = {
  input: {
    handle: string;
    company?: string;
    website?: string;
    location?: string;
    status: string;
    skills: string;
    bio?: string;
    githubusername?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
};

// @desc    Create or Edit user profile
// @access  Private
const editProfile = async (
  _: void,
  args: EditProfileArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');

  const { errors, isValid } = validateProfileInput(args);

  // Check Validation
  if (!isValid) {
    throw new UserInputError('Invalid profile details', { errors });
  }

  // Destructure all the string arguments we're getting from the client
  let {
    handle,
    company,
    location,
    bio,
    githubusername,
    status,
    skills,
    website,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
  } = args.input;

  // Set up the expected structure of a Profile (does not include Experience or Education)
  type ProfileFields = {
    user: Types.ObjectId;
    handle: string;
    company?: string;
    website?: string;
    location?: string;
    status: string;
    skills?: string[];
    bio?: string;
    githubusername?: string;
    social?: {
      youtube?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      instagram?: string;
    };
  };

  const profileFields: ProfileFields = {
    user: user._id,
    handle,
    status,
  };

  // Assign all the incoming string arguments into proper structure as defined in the Type above
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (githubusername) profileFields.githubusername = githubusername;

  // SKills - Split into array
  if (typeof skills !== 'undefined') {
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }

  // Social
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  const profile = await Profile.findOne({ user: user._id });
  if (profile) {
    // Check if handle exists
    const profileByHandle = await Profile.findOne({
      handle: profileFields.handle,
    });
    // Do not update if handle exists
    if (
      profileByHandle &&
      profileByHandle._id.toString() !== profile._id.toString()
    ) {
      errors.handle = 'That handle already exists';
      throw new UserInputError('Invalid profile input', { errors });
    } else {
      // Update if handle doesn't exist
      return await Profile.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true }
      );
    }
  } else {
    // Check if handle exists
    const profile = await Profile.findOne({ handle: profileFields.handle });
    if (profile) {
      errors.handle = 'That handle already exists';
      throw new UserInputError('Invalid profile input', { errors });
    }
    // Save Profile
    return await new Profile(profileFields).save();
  }
};

// @desc    Add experience to profile
// @access  Private
const editExperience = (_: void, args: any) => {};

// @desc    Add education to profile
// @access  Private
const editEducation = (_: void, args: any) => {};

// @desc    Delete experience from profile
// @access  Private
const deleteExperience = (_: void, args: any) => {};

// @desc    Delete education from profile
// @access  Private
const deleteEducation = (_: void, args: any) => {};

// @desc    Delete user and profile
// @access  Private
const deleteProfile = (_: void, args: any) => {};

const resolverMap: IResolvers = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  Query: {
    profile,
  },
  Mutation: {
    editProfile,
  },
};

module.exports = resolverMap;
