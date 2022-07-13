import {LANDING} from './landing.constants';

export const getEmailFormKeyName = (key) => {
  return LANDING.CONTACT_FORM.KEY[key];
};

export const containsExclusionKey = (exclusionKeys, str) => {
  return exclusionKeys.some(element => str.includes(element));
};
