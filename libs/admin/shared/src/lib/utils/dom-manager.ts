/**
 * Function to manage and apply zIndex to elements with a specified target class.
 * If zIndex is not provided, it adjusts zIndex dynamically based on the current zIndex of the first element.
 *
 * @param zIndex The zIndex to be applied. If not provided, zIndex is calculated dynamically.
 * @param targetClass The target class selector for elements to apply zIndex.
 */
export function manageMaskZIndex(
  zIndex?: number,
  targetClass = '.p-component-overlay.p-sidebar-mask'
) {
  let interval: number;

  /**
   * Function to set zIndex on a given HTML element.
   *
   * @param element The HTML element to apply zIndex.
   * @param zIndex The zIndex value to be set.
   */
  const setZIndexOfElement = (element: HTMLElement, zIndex: number) => {
    element.setAttribute('style', `z-index: ${zIndex} !important`);
  };

  /**
   * Interval function to continuously check and apply zIndex to elements with the target class.
   * Runs until elements are found or the interval is cleared.
   */
  interval = setInterval(() => {
    // List of DOM elements with the specified target class
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
      targetClass
    );

    if (elements?.length) {
      // The first element in the list
      const currentElement: HTMLElement = elements[0];

      if (!zIndex) {
        // If zIndex is not provided, calculate it dynamically based on the current zIndex of the first element
        const currentZIndex = +window.getComputedStyle(currentElement)?.zIndex;
        const baseZIndex = currentZIndex ? currentZIndex - 1 : 1000;

        // Apply zIndex to all elements in the list based on the dynamic calculation
        elements.forEach((element, index) => {
          setZIndexOfElement(element, baseZIndex + index);
        });
      } else {
        // If zIndex is provided, apply the exact targeted zIndex to the first element
        setZIndexOfElement(currentElement, zIndex);
      }

      // Clear the interval as the zIndex has been applied
      clearInterval(interval);
    }
  });
}
