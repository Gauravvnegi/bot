import { AgentListResponse } from '../types/response';

// Generate a random alphanumeric string
function generateRandomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Generate a random phone number
function generateRandomPhoneNumber() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return '+91 ' + digits.toString();
}

// Generate dummy random data
export const generateDummyData = (count: number) => {
  const dummyData = {
    entityStateCounts: { Active: 0, Inactive: 0 },
    records: [],
    total: count,
  };

  for (let i = 0; i < dummyData.total; i++) {
    const isActive = Math.random() < 0.5;
    const record = {
      id: (i + 1).toString(),
      name: generateRandomString(5),
      code: '0024',
      verified: Math.random() < 0.5,
      company: 'BigOh',
      iataNo: Math.floor(100 + Math.random() * 9000),
      email: generateRandomString(5) + '@gmail.com',
      phoneNo: generateRandomPhoneNumber(),
      commission: Math.floor(1 + Math.random() * 10),
      active: isActive,
    };
    if (record.active) {
      dummyData.entityStateCounts.Active++;
    } else {
      dummyData.entityStateCounts.Inactive++;
    }
    dummyData.records.push(record);
  }

  return dummyData as AgentListResponse;
};
