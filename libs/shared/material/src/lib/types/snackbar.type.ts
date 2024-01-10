import { ViewContainerRef, InjectionToken } from '@angular/core';
import { AriaLivePoliteness } from '@angular/cdk/a11y';
import { Direction } from '@angular/cdk/bidi';
import { Message } from 'primeng/api';

/**
 * @type SnackBarWithTranslateData
 * @property {string} translateKey Translation key whose value will be fetched from translation files.
 * @property {string} priorityMessage Prioritized message over translated message, usually server messages.
 */
export type SnackBarWithTranslateData = {
  translateKey: string;
  priorityMessage: string;
};

/** Injection token that can be used to access the data that was passed in to a snack bar. */
export declare const SNACK_BAR_DATA: InjectionToken<any>;
/** Possible values for horizontalPosition on MatSnackBarConfig. */
export declare type SnackBarHorizontalPosition =
  | 'start'
  | 'center'
  | 'end'
  | 'left'
  | 'right';
/** Possible values for verticalPosition on SnackBarConfig. */
export declare type SnackBarVerticalPosition = 'top' | 'bottom';
/*a*
 * Configuration used when opening a snack-bar.
 */
export declare class SnackBarConfig<D = any> {
  /** The politeness level for the AriaLiveAnnouncer announcement. */
  politeness?: AriaLivePoliteness;
  /**
   * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
   * component or template, the announcement message will default to the specified message.
   */
  announcementMessage?: string;
  /**
   * The view container that serves as the parent for the snackbar for the purposes of dependency
   * injection. Note: this does not affect where the snackbar is inserted in the DOM.
   */
  viewContainerRef?: ViewContainerRef;
  /** The length of time in milliseconds to wait before autoically dismissing the snack bar. */
  duration?: number;
  /** Extra CSS classes to be added to the snack bar container. */
  panelClass?: string | string[];
  /** Text layout direction for the snack bar. */
  direction?: Direction;
  /** Data being injected into the child component. */
  data?: D | null;
  /** The horizontal position to place the snack bar. */
  horizontalPosition?: SnackBarHorizontalPosition;
  /** The vertical position to place the snack bar. */
  verticalPosition?: SnackBarVerticalPosition;
}

export type MessagePosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'
  | 'center';

export type MessageSnackbarConfig = {
  position?: MessagePosition;
  title?: String;
  iconSrc?: String;
} & Message;

export enum ToastKeys {
  default = 'default',
  notification = 'notification',
  whatsappNotification = 'whatsapp-notification',
}
