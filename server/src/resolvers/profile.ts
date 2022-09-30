import { IResolvers } from '@graphql-tools/utils';
import { DateTimeResolver, URLResolver } from 'graphql-scalars';

// @desc    Get current users profile
// @access  Private
const profile = () => {};

// @desc    Get all profiles
// @access  Public
const allProfiles = () => {};

// @desc    Get profile by handle
// @access  Public
const profileByHandle = () => {};

// @desc    Get profile by user ID
// @access  Public
const profileById = () => {};

// @desc    Create or Edit user profile
// @access  Private
const editProfile = () => {};

// @desc    Add experience to profile
// @access  Private
const editExperience = () => {};

// @desc    Add education to profile
// @access  Private
const editEducation = () => {};

// @desc    Delete experience from profile
// @access  Private
const deleteExperience = () => {};

// @desc    Delete education from profile
// @access  Private
const deleteEducation = () => {};

// @desc    Delete user and profile
// @access  Private
const deleteProfile = () => {};

const resolverMap: IResolvers = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  Query: {},
  Mutation: {},
};
