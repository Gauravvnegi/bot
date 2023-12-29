import { GuestDatatableModalComponent } from '../components';

export type ChartTypeOption = {
  name: string;
  value: string;
  url: string;
  backgroundColor: string;
};

export type SelectedEntityState = {
  entityState: string;
};

export type SearchGuestResponse = {
  id: string;
  salutation?: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc?: string;
    contactNumber?: string;
    emailId?: string;
  };
  nationality?: string;
  age: number;
};

export type GuestModalStatus =
  | 'BOT'
  | 'EMAIL'
  | 'MICROSITE'
  | 'OTHERS'
  | 'WHATSAPP';

export type GuestDialogData = Partial<GuestDatatableModalComponent>;

export type GuestModalType =
  | 'payment.title'
  | 'document.title'
  | 'source.title';
