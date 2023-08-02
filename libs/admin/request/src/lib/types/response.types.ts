import { EntityState } from "@hospitality-bot/admin/shared";
import { RequestStatus } from "../constants/request";

type Room = {
  id: string | null;
  roomNumber: string;
  type: string;
  unit: number;
  chargeCode: string | null;
  status: string | null;
  roomClass: string | null;
};

type PrimaryGuest = {
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: Record<string, unknown>;
  age: number;
  documentRequired: boolean;
};

type GuestDetails = {
  primaryGuest: PrimaryGuest;
  accompanyGuests: unknown[];
  sharerGuests: unknown[];
  secondaryGuest: unknown[];
  kids: unknown[];
  allGuest: Record<string, unknown>;
};

export type JobRequestResponse = {
  id: string;
  confirmationNumber: string | null;
  rooms: Room[];
  remarks: string;
  requestTime: number;
  journey: string;
  state: string;
  status: string;
  action: string;
  reservationId: string | null;
  entityId: string;
  guestDetails: GuestDetails;
  stayDetails: unknown | null;
  priority: string;
  jobDuration: number;
  jobID: string;
  jobNo: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  closedTime: number;
  source: string;
  pickupTime: number;
  timeLeft: number;
  sla: number;
  itemId: string;
};

export type AllJobRequestResponse = {
  total: number;
  entityStateCounts: EntityState<RequestStatus>;
  records: JobRequestResponse[];
};
