export type QueryConfig = {
  queryObj: string;
};

export type SendersData = Record<
  'subscribers' | 'listing' | 'individual',
  string[]
>;

export type ReceiverFields = 'to' | 'cc' | 'bcc';

export type MessageObj = {
  key: string;
  message: string;
};
