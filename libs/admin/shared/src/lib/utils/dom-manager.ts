export function manageMaskZIndex(
  zIndex: number,
  targetClass = '.p-component-overlay.p-sidebar-mask'
) {
  let interval;
  interval = setInterval(() => {
    const elements = document.querySelectorAll(targetClass);
    if (elements?.length) {
      elements[0].setAttribute('style', `z-index: ${zIndex} !important;`);
      clearInterval(interval);
    }
  });
}
