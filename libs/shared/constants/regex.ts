export class Regex {
  public static EMAIL_REGEX = /^\s*(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))\s*$/;
  public static NUMBER_REGEX = /^[0-9]*$/;
  public static DECIMAL_REGEX = /^(0|[1-9]\d*)(\.\d+)?$/;
  public static NAME = '^[A-Za-z]*$|^[A-Za-z][A-Za-z ]*[A-Za-z]$';
  public static URL_REGEX = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm;
}
