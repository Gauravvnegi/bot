import { Filter } from '@hospitality-bot/admin/shared';
import { FilterTabs } from '../type/product';
export const notificationIconMapping = {
  WHATSAPP: 'assets/svg/chatting.svg',
  'IN-HOUSE REQUEST': 'assets/svg/request_icon.svg',
  FEEDBACK: 'assets/svg/nps-services.svg',
  'CHECK -IN': 'assets/svg/checkin.svg',
};

export const TabFilterItems: Filter<string, string>[] = [
  {
    value: FilterTabs.PROPERTY,
    iconSrc: 'assets/images/property.svg',
  },
  {
    value: FilterTabs.OUTLETS,
    iconSrc: 'assets/images/outlet.svg',
  },
  {
    value: FilterTabs.GUEST,
    iconSrc: 'assets/images/guest.svg',
  },
];
