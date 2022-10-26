export class Regex {
  public static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/;
  public static PHONE_REGEX = /^\d{1,9}[^./,;':@]?$/;
  public static PHONE10_REGEX = /^[1-9]{1}[0-9]{5,15}$/;
  public static NUMBER_REGEX = /^[0-9]*$/;
  public static ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]*$/;
  public static CREDIT_CARD_REGEX =
    '\\b[0-9]{4}\\s[0-9]{4}\\s[0-9]{4}\\s[0-9]{4}\\b';
  public static CREDIT_CARD_MASK_REGEX = [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  public static NAME = /^[a-zA-Z ]+$/;
}
