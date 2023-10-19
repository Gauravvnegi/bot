export enum GuestTypes {
  primary = 'primary',
  secondary = 'secondary',
}

export enum GuestRole {
  sharer = 'sharer',
  accompany = 'accompany',
  kids = 'kids',
  undefined = '',
}

export const RequiredFields = {
  primary: ['salutation', 'firstName', 'lastName', 'country', 'email', 'phone'],
  sharer: ['salutation', 'firstName', 'lastName', 'country', 'email', 'phone'],
  accompany: [],
  kids: [],
};
