import { IResolvers } from '@graphql-tools/utils';
import { UserInputError, AuthenticationError } from 'apollo-server-core';
import { DateResolver, URLResolver } from 'graphql-scalars';
import { Types } from 'mongoose';
import { JWTPayloadType } from '../auth/authGen';
import Validator from 'validator';

import { Profile } from '../models/Profile';
import { User } from '../models/User';

// @desc    Get current users profile
// @access  Private
const profile = async (
  _: void,
  args: any,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  try {
    const profile = await Profile.findOne({ user: user._id })
      .populate('user', ['name', 'avatar'])
      .exec();

    return profile;
  } catch (err) {
    throw new UserInputError('No profile found for this user');
  }
};

// @desc    Get all profiles
// @access  Public
const allProfiles = async () => {
  const profiles = await Profile.find()
    .populate('user', ['name', 'avatar'])
    .exec();

  if (!profiles) {
    throw new UserInputError('No profiles found');
  }
  return profiles;
};

// Argument Types Received for ProfileByHandle Mutation
type ProfileByHandleArgs = {
  input: { handle: string };
};

// @desc    Get profile by handle
// @access  Public
const profileByHandle = async (_: void, args: ProfileByHandleArgs) => {
  const profile = await Profile.findOne({ handle: args.input.handle }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile) {
    throw new UserInputError('Profile not found');
  }
  return profile;
};

// Argument Types Received for ProfileById Mutation
type ProfileByIdArgs = {
  input: { user_id: Types.ObjectId };
};

// @desc    Get profile by user ID
// @access  Public
const profileById = async (_: void, args: ProfileByIdArgs) => {
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

// @desc    Create or Edit user profile
// @access  Private
const editProfile = async (
  _: void,
  args: EditProfileArgs,
  { user }: { user: JWTPayloadType }
) => {
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
      throw new UserInputError('That handle already exists');
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

// @desc    Add experience to profile
// @access  Private
const editExperience = async (
  _: void,
  args: EditExperienceArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  const { title, company, location, from, to, current, description } =
    args.input;

  if ((!to && current === false) || (to && current === true)) {
    throw new UserInputError(
      "Experience 'To' date OR 'Current' option must be selected"
    );
  }

  const profile = await Profile.findOne({ user: user._id });
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };

  if (profile && profile.experience) {
    // Add to experience array
    profile.experience.unshift(newExp);
    return await profile.save();
  } else {
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

// @desc    Add education to profile
// @access  Private
const editEducation = async (
  _: void,
  args: EditEducationArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  const { school, degree, fieldofstudy, from, to, current, description } =
    args.input;

  if ((!to && current === false) || (to && current === true)) {
    throw new UserInputError(
      "Experience 'To' date OR 'Current' option must be selected"
    );
  }

  const profile = await Profile.findOne({ user: user._id });

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };

  // Add to education array
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

// @desc    Delete experience from profile
// @access  Private
const deleteExperience = async (
  _: void,
  args: DeleteExperienceArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  const profile = await Profile.findOne({ user: user._id });

  if (profile && profile.experience) {
    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item._id)
      .indexOf(args.input.exp_id);

    //Splice out of array
    profile.experience.splice(removeIndex, 1);
    // Save
    return await profile.save();
  }
};

// Argument Types Received for Delete Education Mutation
export type DeleteEducationArgs = {
  input: {
    exp_id: Types.ObjectId;
  };
};

// @desc    Delete education from profile
// @access  Private
const deleteEducation = async (
  _: void,
  args: DeleteEducationArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  const profile = await Profile.findOne({ user: user._id });

  if (profile && profile.education) {
    // Get remove index
    const removeIndex = profile.education
      .map((item) => item._id)
      .indexOf(args.input.exp_id);

    //Splice out of array
    profile.education.splice(removeIndex, 1);
    // Save
    return await profile.save();
  }
};

// @desc    Delete user and profile
// @access  Private
const deleteProfile = async (
  _: void,
  args: any,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new AuthenticationError('User not logged in');

  try {
    await Profile.findOneAndRemove({ user: user._id });
    await User.findOneAndRemove({ _id: user._id });
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
