import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageReloadService {
  private confirmMessage =
    'Are you sure you want to leave this page? Your unsaved changes may be lost.';

  enablePageReloadConfirmation() {
    window.addEventListener('beforeunload', this.confirmPageReload);
  }

  disablePageReloadConfirmation() {
    window.removeEventListener('beforeunload', this.confirmPageReload);
  }

  private confirmPageReload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = true;
    return this.confirmMessage;
  }
}
