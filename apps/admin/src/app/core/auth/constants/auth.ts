export const authConstants = {
  linkUrl: {
    termsAndCondition: 'https://www.botshot.in/terms-of-uses/',
    aboutUs: 'https://www.botshot.in/about-us/',
    privacyPolicy: 'https://www.botshot.in/privacy-policy/',
  },
  imgUrl: {
    bell: 'assets/svg/bell.svg',
    hotel: 'assets/svg/hotel.svg',
    luggage: 'assets/svg/luggage.svg',
    metroHotel: 'assets/svg/metro-hotel.svg',
    liveDashboard: 'assets/svg/dashboard-white.svg',
    filter: 'assets/svg/Filter.svg',
    analytics: 'assets/svg/Analytics.svg',
    liveRequest: 'assets/svg/live-help.svg',
    search: 'assets/svg/search.svg',
    botshotLogo: 'assets/images/botshotlogo.png',
  },
  managingOptions: [
    {
      id: 1,
      label: 'createWith',
      url: 'assets/svg/dashboard-white.svg',
    },
    {
      id: 2,
      label: 'eFront Desk',
      url: 'assets/svg/Filter.svg',
    },
    { id: 3, label: 'Analytics', url: 'assets/svg/Analytics.svg' },
    {
      id: 4,
      label: 'Freddie',
      url: 'assets/svg/live-help.svg',
    },
    { id: 5, label: 'Heda', url: 'assets/svg/search.svg' },
    {
      id: 6,
      label: 'eMarket-IT',
      url: 'assets/svg/Analytics.svg',
    },
    {
      id: 7,
      label: 'channelSynchro',
      url: 'assets/svg/Analytics.svg',
    },
    {
      id: 7,
      label: 'RevMaxi',
      url: 'assets/svg/Analytics.svg',
    },
    {
      id: 7,
      label: 'PredictoPMS',
      url: 'assets/svg/Analytics.svg',
    },
    {
      id: 7,
      label: 'ComplaintTrackr',
      url: 'assets/svg/Analytics.svg',
    },
  ],
  alt: {
    bell: 'bell',
    hotel: 'hotel',
    luggage: 'luggage',
    metroHotel: 'metro-hotel',
    liveDashboard: 'dashboard',
    filter: 'Filter',
    analytics: 'Analytics',
    liveRequest: 'live-help',
    search: 'search',
    botshotLogo: 'botshotlogo',
  },
  passwordMinLength: 1,
  passwordMaxLength: 20,

  //product certification
  productCertification: [
    {
      id: 1,
      label: 'google Certified',
      url: 'assets/svg/google-certification2.svg',
    },
    {
      id: 2,
      label: 'iso Certified',
      url: 'assets/svg/iso-certification.svg',
    },
    {
      id: 3,
      label: 'gdr Certified',
      url: 'assets/svg/gdr-certification.svg',
    },
    {
      id: 4,
      label: 'opera Certified',
      url: 'assets/svg/opera-certification2.png',
    },
  ],
};

import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.value;
    const uppercaseRegex = /[A-Z]/;
    const numericRegex = /[0-9]/;
    const alphanumericRegex = /^[A-Za-z0-9]+$/;

    if (!password || password.length < 1) {
      return { required: true };
    }

    if (!uppercaseRegex.test(password.charAt(0))) {
      return { uppercaseStart: true };
    }

    if (
      password.length < 8 ||
      password.length > authConstants.passwordMaxLength
    ) {
      return { invalidLength: true };
    }

    if (!uppercaseRegex.test(password)) {
      return { noUppercase: true };
    }

    if (!numericRegex.test(password)) {
      return { noNumeric: true };
    }

    if (!alphanumericRegex.test(password)) {
      return { nonAlphanumeric: true };
    }

    return null; // Password meets all criteria
  };
}

export function confirmPasswordValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.root.get('password');
    const confirmPassword = control.root.get(controlName);

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null; // Don't show error if confirm password field is empty
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null; // Passwords match
  };
}
