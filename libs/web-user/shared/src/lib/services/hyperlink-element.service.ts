import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class HyperlinkElementService {
	$element = new Subject();
	elementObject: any = {};
  constructor() { }

  setSelectedElement(element) {
		this.$element.next({
			element: element,
		});
	}
}