import { set } from 'lodash';

export class PaymentMainStatus {
  data: any;
  backRedirectUrl: string;
  nextRedirectUrl: string;
  label: string;
  note: string;
  image: string;
  back: string;
  next: string;
  showBackButton: boolean;
  showSummaryButton: boolean;

  deserialize(response: any, url: string, journey: string, status) {
		Object.assign(
			this,
			set({}, 'data', response),
			set({}, 'backRedirectUrl', url + '&index=1'),
			set({}, 'nextRedirectUrl', url),
			set({}, 'showSummaryButton', true),
			set({}, 'showBackButton', true),
			set({}, 'back', `Back To ${journey}`),
		)
		this.label = status === 'SUCCESS'
			? 'Your Payment is completed successfully'
			: 'Your Payment is Failed';
		this.image = status === 'SUCCESS'
			? 'assets/payment_success.png'
			: 'assets/payment_fail.png';
	
		this.note = status === 'SUCCESS'
			? 'A confirmation email has been sent to '
			: 'An Error ocurred while processing your payment';
	
		if (status === "SUCCESS") {
			this.next = 'View Summary';
			this.showBackButton = false;
		} else {
			this.next = 'Retry Payment';
		}
		return this;
  }
}
