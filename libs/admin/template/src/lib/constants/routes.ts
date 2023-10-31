import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoutes = {
  library: { label: 'Library', link: './' },
  template: { label: 'Template', link: '/pages/library/template' },
  createTemplate: { label: 'Create Template', link: '/create-template' },
  editTemplate: { label: 'Edit Template', link: 'edit-template/:templateId' },
  savedTemplate: {
    label: 'Saved Templates',
    link: 'create-template/saved',
  },
  preDesignedTemplate: {
    label: 'Pre-Designed Templates',
    link: 'create-template/pre-designed',
  },
  htmlEditorTemplate: {
    label: 'HTML Editor',
    link: 'create-template/html-editor',
  },
};

export const templateRoutes: Record<
  | 'template'
  | 'createTemplate'
  | 'editTemplate'
  | 'savedTemplate'
  | 'editTemplateWithSaved'
  | 'preDesignedTemplate'
  | 'editTemplateWithPreDesigned'
  | 'htmlEditorTemplate'
  | 'viewHtmlEditorTemplate'
  | 'editTemplateWithHtmlEditor',
  PageRoutes
> = {
  template: {
    route: '',
    navRoutes: [],
    title: 'template',
  },
  createTemplate: {
    route: 'create-template',
    navRoutes: [navRoutes.createTemplate],
    title: 'Create Template',
  },
  editTemplate: {
    route: 'edit-template/:templateId',
    navRoutes: [navRoutes.editTemplate],
    title: 'Edit Template',
  },
  savedTemplate: {
    route: 'saved',
    navRoutes: [navRoutes.createTemplate, navRoutes.savedTemplate],
    title: 'Saved Templates',
  },
  editTemplateWithSaved: {
    route: 'saved',
    navRoutes: [navRoutes.editTemplate, navRoutes.editTemplate],
    title: 'Saved Templates',
  },
  preDesignedTemplate: {
    route: 'pre-designed',
    navRoutes: [navRoutes.createTemplate, navRoutes.preDesignedTemplate],
    title: 'Pre-Designed Templates',
  },
  editTemplateWithPreDesigned: {
    route: 'pre-designed',
    navRoutes: [navRoutes.editTemplate, navRoutes.preDesignedTemplate],
    title: 'Pre-Designed Templates',
  },
  htmlEditorTemplate: {
    route: 'html-editor',
    navRoutes: [navRoutes.createTemplate, navRoutes.htmlEditorTemplate],
    title: 'HTML Editor',
  },
  viewHtmlEditorTemplate: {
    route: 'view/html-editor',
    navRoutes: [navRoutes.editTemplate, navRoutes.htmlEditorTemplate],
    title: 'View HTML Template',
  },
  editTemplateWithHtmlEditor: {
    route: 'edit/html-editor',
    navRoutes: [navRoutes.editTemplate, navRoutes.htmlEditorTemplate],
    title: 'HTML Editor',
  },
};
