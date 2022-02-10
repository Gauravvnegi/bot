/**
 * @type SnackBarWithTranslateData
 * @property {string} translateKey Translation key whose value will be fetched from translation files.
 * @property {string} priorityMessage Prioritized message over translated message, usually server messages.
 */
export type SnackBarWithTranslateData = {
  translateKey: string;
  priorityMessage: string;
};
