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
  primary: ['firstName', 'lastName', 'country', 'email', 'phone'],
  sharer: ['firstName', 'lastName'],
  accompany: [],
  kids: [],
};
