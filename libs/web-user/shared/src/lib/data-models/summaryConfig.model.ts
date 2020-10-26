import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class SummaryDetails implements Deserializable {
	id: string;
	arrivalTime: number;
	departureTime: number;
	stateCompletedSteps: number;
  	stayDetails: StayDetails;
  	guestDetails: GuestDetails;
  	paymentSummary: PaymentSummary;
  	healthDeclaration: Health;

	deserialize(summary) {
		Object.assign(
			this,
			set({}, 'id', get(summary, ['id'])),
			set({}, 'arrivalTime', get(summary, ['arrivalTime'])),
			set({}, 'departureTime', get(summary, ['departureTime'])),
			set({}, 'stateCompletedSteps', get(summary, ['stateCompletedSteps'])),
		)
		this.guestDetails = new GuestDetails().deserialize(summary.guestDetails);
		this.healthDeclaration = new Health().deserialize(summary.healthDeclaration);
		this.stayDetails = new StayDetails().deserialize(summary.stayDetails);
		this.paymentSummary = new PaymentSummary().deserialize(summary.paymentSummary);
		return this;
	}
}

export class Health {
	statusMessage: Status;
	url: string;

	deserialize(summary) {
		Object.assign(
			this,
			set({}, 'statusMessage', get(summary, ['statusMessage'])),
			set({}, 'url', get(summary, ['url'])),
		)
		return this;
	}
}

export class StayDetails {
	statusMessage: Status;
  	arrivalTime: number;
  	departureTime: number;
  	roomType: string;
  	adultsCount: number;
  	kidsCount: number;
	comments: string;
	expectedArrivalTime: number;
	expectedDepartureTime: number;
	roomNumber: number;

	deserialize(summary) {
		Object.assign(
			this,
			set({}, 'statusMessage', get(summary, ['statusMessage'])),
			set({}, 'arrivalTime', get(summary, ['arrivalTime'])),
			set({}, 'departureTime', get(summary, ['departureTime'])),
			set({}, 'roomType', get(summary, ['roomType'])),
			set({}, 'adultsCount', get(summary, ['adultsCount'])),
			set({}, 'kidsCount', get(summary, ['kidsCount'])),
			set({}, 'comments', get(summary, ['comments'])),
			set({}, 'expectedArrivalTime', get(summary, ['expectedArrivalTime'])),
			set({}, 'expectedDepartureTime', get(summary, ['expectedDepartureTime'])),
			set({}, 'roomNumber', get(summary, ['roomNumber'])),
		)
		return this;
	}
}

export class Guest {
  	id: string;
  	nameTitle: string;
  	firstName: string;
	lastName: string;
	contactDetails: ContactDetails;
  	type: object;
  	nationality: object;
  	document: DocumentDetails[];
  	healthDeclarationFormId: object;
  	pmsGuestId: object;
  	regcardUrl: string;
	signatureUrl: string;
	statusMessage: Status;

	deserialize(summary) {
		Object.assign(
			this,
			set({}, 'id', get(summary, ['id'])),
			set({}, 'nameTitle', get(summary, ['nameTitle'])),
			set({}, 'firstName', get(summary, ['firstName'])),
			set({}, 'lastName', get(summary, ['lastName'])),
			set({}, 'statusMessage', get(summary, ['statusMessage'])),
			set({}, 'regcardUrl', get(summary, ['regcardUrl'])),
			set({}, 'signatureUrl', get(summary, ['signatureUrl'])),
		)
		this.contactDetails = new ContactDetails().deserialize(summary.contactDetails);
		return this;
	}
}

export class PaymentSummary {
	statusMessage: Status;
	totalAmount: number;
	taxAmount: number;
	totalDiscount: number;
	subtotal: number;
	paidAmount: number;
	dueAmount: number;

	deserialize(summary) {
		Object.assign(
			this,
			set({}, 'statusMessage', get(summary, ['statusMessage'])),
			set({}, 'totalAmount', get(summary, ['totalAmount'])),
			set({}, 'taxAmount', get(summary, ['taxAmount'])),
			set({}, 'totalDiscount', get(summary, ['totalDiscount'])),
			set({}, 'subtotal', get(summary, ['subtotal'])),
			set({}, 'paidAmount', get(summary, ['paidAmount'])),
			set({}, 'dueAmount', get(summary, ['dueAmount'])),
		)
		return this;
	}
}

export class GuestDetails {
  primaryGuest: Guest;
	secondaryGuest: Guest[];
	
	deserialize(summary) {
		this.primaryGuest = new Guest().deserialize(summary.primaryGuest);
		return this;
	}
}

export class ContactDetails {
  	cc: string;
  	mobileNumber: string;
	emailId: string;
	
	deserialize(summary) {
		Object.assign(
			this,
			set({}, 'cc', get(summary, ['cc'])),
			set({}, 'mobileNumber', get(summary, ['contactNumber'])),
			set({}, 'emailId', get(summary, ['emailId'])),
		)
		return this;
	}
}

export class DocumentDetails {
  	id: string;
  	documentType: string;
  	frontUrl: string;
  	backUrl: string;
}

export class Status {
	code: number;
	status: string;
	state: string;
	remarks: string;
}