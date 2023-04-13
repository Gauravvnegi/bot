import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoutes = {
  library: { label: 'Library', link: './' },
  template: { label: 'Template', link: '/pages/library/template' },
  createTemplate: { label: 'Create Template', link: './' },
  editTemplate: { label: 'Edit Template', link: './' },
};

export const templateRoutes: Record<
  'template' | 'CreateTemplate' | 'EditTemplate',
  PageRoutes
> = {
  template: {
    route: '',
    navRoutes: [],
    title: 'template',
  },
  CreateTemplate: {
    route: 'create-template',
    navRoutes: [],
    title: 'Create Template',
  },
  EditTemplate: {
    route: 'edit-template',
    navRoutes: [],
    title: '',
  },
};
