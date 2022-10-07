import { IResolvers } from '@graphql-tools/utils';
import { UserInputError, AuthenticationError } from 'apollo-server-core';
import { DateResolver, URLResolver } from 'graphql-scalars';
import { Types } from 'mongoose';
import { JWTPayloadType } from '../auth/authGen';
import Validator from 'validator';

import { Profile } from '../models/Profile';
import { User } from '../models/User';

// @type    Query
// @desc    Get current users profile
// @access  Private
const profile = async (
  _: void,
  args: any,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  // Get and return the logged in user's profile as well as populating the name and avatar from the user document
  try {
    const profile = await Profile.findOne({ user: user._id })
      .populate('user', ['name', 'avatar'])
      .exec();

    return profile;
  } catch (err) {
    throw new UserInputError('No profile found for this user');
  }
};

// @type    Query
// @desc    Get all profiles
// @access  Public
const allProfiles = async () => {
  // Get all user profiles as well as populating the name and avatar of each user from the user document
  const profiles = await Profile.find()
    .populate('user', ['name', 'avatar'])
    .exec();

  if (!profiles) {
    throw new UserInputError('No profiles found');
  }
  return profiles;
};

// Argument Types Received for ProfileByHandle Query
type ProfileByHandleArgs = {
  input: { handle: string };
};

// @type    Query
// @desc    Get profile by handle
// @access  Public
const profileByHandle = async (_: void, args: ProfileByHandleArgs) => {
  // Get user profile by their handle and populate the user's name and avatar from the users document
  const profile = await Profile.findOne({ handle: args.input.handle }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile) {
    throw new UserInputError('Profile not found');
  }
  return profile;
};

// Argument Types Received for ProfileById Query
type ProfileByIdArgs = {
  input: { user_id: Types.ObjectId };
};

// @type    Query
// @desc    Get profile by user ID
// @access  Public
const profileById = async (_: void, args: ProfileByIdArgs) => {
  // Get user profile by their MongoDB ID and populate the user's name and avatar from the users document
  const profile = await Profile.findOne({ user: args.input.user_id }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile) {
    throw new UserInputError('Profile not found');
  }
  return profile;
};

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

// @type    Mutation
// @desc    Create or Edit user profile
// @access  Private
const editProfile = async (
  _: void,
  args: EditProfileArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

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

  // Check if the user's handle is long enough
  if (!Validator.isLength(handle, { min: 2, max: 40 })) {
    throw new UserInputError('Handle needs to be between 2 and 4 characters');
  }

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

  // Initial set up the profileFields object that will be sent to MongoDB
  const profileFields: ProfileFields = {
    user: user._id,
    handle,
    status,
  };

  // Assign all the available incoming string arguments into proper structure as defined in the Type above
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (githubusername) profileFields.githubusername = githubusername;

  // Skills from client are comma separated - Split into array
  if (typeof skills !== 'undefined') {
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }

  // Assign Social Fields within Social Object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  // Find user profile
  const profile = await Profile.findOne({ user: user._id });

  // Check if profile exists and requires updating
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
      throw new UserInputError('That handle already exists');
    } else {
      // Update if handle doesn't exist
      return await Profile.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true }
      );
    }
  }
  // If profile doesn't exist create a new profile
  else {
    // Check if handle exists
    const profile = await Profile.findOne({ handle: profileFields.handle });
    if (profile) {
      throw new UserInputError('That handle already exists');
    }
    // Save Profile
    return await new Profile(profileFields).save();
  }
};

// Argument Types Received for Edit Experience Mutation
export type EditExperienceArgs = {
  input: {
    title: string;
    company: string;
    location?: string;
    from: Date;
    to?: Date;
    current?: boolean;
    description?: string;
  };
};

// @type    Mutation
// @desc    Add experience to profile
// @access  Private
const editExperience = async (
  _: void,
  args: EditExperienceArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  const { title, company, location, from, to, current, description } =
    args.input;

  // The user must provide either a 'to' date or select that this is their 'current' job
  if ((!to && current === false) || (to && current === true)) {
    throw new UserInputError(
      "Experience 'To' date OR 'Current' option must be selected"
    );
  }

  // Find logged in user's profile
  const profile = await Profile.findOne({ user: user._id });

  // Create the new experience object with user provided data
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };

  // If the profile exists, add the new experience in the front of the experience array and save the new experience array
  if (profile && profile.experience) {
    // Add to experience array
    profile.experience.unshift(newExp);
    return await profile.save();
  } else {
    // If profile or experience doesn't exist, throw an error
    throw new UserInputError('Invalid experience details');
  }
};

// Argument Types Received for Edit Education Mutation
export type EditEducationArgs = {
  input: {
    school: string;
    degree: string;
    fieldofstudy: string;
    from: Date;
    to: Date;
    current: boolean;
    description: string;
  };
};

// @type    Mutation
// @desc    Add education to profile
// @access  Private
const editEducation = async (
  _: void,
  args: EditEducationArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  const { school, degree, fieldofstudy, from, to, current, description } =
    args.input;

  // The user must provide either a 'to' date or select that this is they are currently going through this educational program
  if ((!to && current === false) || (to && current === true)) {
    throw new UserInputError(
      "Experience 'To' date OR 'Current' option must be selected"
    );
  }

  // Find logged in user's profile
  const profile = await Profile.findOne({ user: user._id });

  // Create the new education object with user provided data
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };

  // Add to front of education array and save
  if (profile && profile.education) {
    profile.education.unshift(newEdu);
    return await profile.save();
  } else {
    throw new UserInputError('Invalid education details');
  }
};

// Argument Types Received for Delete Experience Mutation
export type DeleteExperienceArgs = {
  input: {
    exp_id: Types.ObjectId;
  };
};

// @type    Mutation
// @desc    Delete experience from profile
// @access  Private
const deleteExperience = async (
  _: void,
  args: DeleteExperienceArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  // Find logged in user's profile
  const profile = await Profile.findOne({ user: user._id });

  // If profile and experience exists
  if (profile && profile.experience) {
    // Create an array of profile experience IDs and find the index of the experience ID that needs to be deleted
    const removeIndex = profile.experience
      .map((item) => item._id)
      .indexOf(args.input.exp_id);

    // Splice the experience out of array based on the index determined above
    profile.experience.splice(removeIndex, 1);

    // Return user profile with updated experience array
    return await profile.save();
  } else {
    throw new UserInputError('Profile experience not found');
  }
};

// Argument Types Received for Delete Education Mutation
export type DeleteEducationArgs = {
  input: {
    exp_id: Types.ObjectId;
  };
};

// @type    Mutation
// @desc    Delete education from profile
// @access  Private
const deleteEducation = async (
  _: void,
  args: DeleteEducationArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  // Find logged in user's profile
  const profile = await Profile.findOne({ user: user._id });

  if (profile && profile.education) {
    // Create an array of profile education IDs and find the index of the education ID that needs to be deleted
    const removeIndex = profile.education
      .map((item) => item._id)
      .indexOf(args.input.exp_id);

    // Splice the education out of array based on the index determined above
    profile.education.splice(removeIndex, 1);

    // Return user profile with updated education array
    return await profile.save();
  } else {
    throw new UserInputError('Profile education not found');
  }
};

// @type    Mutation
// @desc    Delete user and profile
// @access  Private
const deleteProfile = async (
  _: void,
  args: any,
  { user }: { user: JWTPayloadType }
) => {
  // Check if user is logged in
  if (!user) throw new AuthenticationError('User not logged in');

  try {
    // Find the logged in user's profile and delete it
    await Profile.findOneAndRemove({ user: user._id });
    // Find the logged in user's account and delete it
    await User.findOneAndRemove({ _id: user._id });
    // Return success if there was no error with either operation above
    return { result: 'success' };
  } catch (err) {
    throw new UserInputError('Database error. Could not delete user.');
  }
};

const resolverMap: IResolvers = {
  Date: DateResolver,
  URL: URLResolver,
  Query: {
    profile,
    allProfiles,
    profileByHandle,
    profileById,
  },
  Mutation: {
    editProfile,
    editExperience,
    editEducation,
    deleteExperience,
    deleteEducation,
    deleteProfile,
  },
};

module.exports = resolverMap;
