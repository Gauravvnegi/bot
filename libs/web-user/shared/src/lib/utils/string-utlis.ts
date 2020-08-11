export function concat(
  value: string,
  defaultValue?: string,
  prefixString?: string,
  suffixString?: string
) {
  return ''
    .concat(prefixString || '')
    .concat(value || defaultValue)
    .concat(suffixString || '')
    .trim();
}
