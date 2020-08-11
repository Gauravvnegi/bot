import { Injectable, Renderer2 } from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class UtilityService {
  constructor() {}

  getFieldClasses(fieldComponent) {
    let classes: any = {
      fieldMainWrapperClasses: '',
      fieldWrapperClasses: '',
      fieldMasterLabelClasses: '',
      fieldLabelContainerClasses: '',
      fieldContainerClasses: '',
      labelClasses: '',
      fieldErrorWrapperClasses: '',
      fieldErrorClasses: '',
      fieldClasses: '',
      nestedFieldContainerClasses: '',
      fieldContainerWrapperClasses: '',
      fieldIconClasses: '',
      fieldIconContainerClasses: '',
    };
    let classesStr = `mat__field--wrapper`;
    classes.fieldMasterLabelClasses = 'mat__field--heading';
    classes.fieldContainerWrapperClasses = classesStr;

    if (fieldComponent.settings && fieldComponent.settings.type == 'radio') {
      classes.fieldMainWrapperClasses = 'flex__column';
      classes.fieldClasses = 'radion__btn--group';
    }
    if (fieldComponent.settings && fieldComponent.settings.type == 'textarea') {
      classes.fieldMainWrapperClasses = 'flex__column';
    }

    return classes;
  }

  setupMediaQueries(fieldComponent, mediaQueries, Breakpoints) {
    fieldComponent._breakpointObserver
      .observe(mediaQueries.map((size) => Breakpoints[size]))
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[Breakpoints.XSmall]) {
          fieldComponent.settings.style.fieldSetWrapperStyles = Object.assign(
            {},
            fieldComponent.settings.style.fieldSetWrapperStyles,
            fieldComponent.settings.mediaQuery.breakpoints.XSmall.styles
              .fieldSetWrapperStyles
          );
        } else if (state.breakpoints[Breakpoints.Small]) {
          fieldComponent.settings.style.fieldSetWrapperStyles = Object.assign(
            {},
            fieldComponent.settings.style.fieldSetWrapperStyles,
            fieldComponent.settings.mediaQuery.breakpoints.Small.styles
              .fieldSetWrapperStyles
          );
        } else if (state.breakpoints[Breakpoints.Medium]) {
          fieldComponent.settings.style.fieldSetWrapperStyles = Object.assign(
            {},
            fieldComponent.settings.style.fieldSetWrapperStyles,
            fieldComponent.settings.mediaQuery.breakpoints.Medium.styles
              .fieldSetWrapperStyles
          );
        } else if (state.breakpoints[Breakpoints.Large]) {
          fieldComponent.settings.style.fieldSetWrapperStyles = Object.assign(
            {},
            fieldComponent.settings.style.fieldSetWrapperStyles,
            fieldComponent.settings.mediaQuery.breakpoints.Large.styles
              .fieldSetWrapperStyles
          );
        } else if (state.breakpoints[Breakpoints.XLarge]) {
          fieldComponent.settings.style.fieldSetWrapperStyles = Object.assign(
            {},
            fieldComponent.settings.style.fieldSetWrapperStyles,
            fieldComponent.settings.mediaQuery.breakpoints.XLarge.styles
              .fieldSetWrapperStyles
          );
        } else {
          fieldComponent.settings.style.fieldSetWrapperStyles = Object.assign(
            {},
            fieldComponent.settings.style.fieldSetWrapperStyles,
            fieldComponent.settings.mediaQuery.default.styles
              .fieldSetWrapperStyles
          );
        }
      });
  }
}
