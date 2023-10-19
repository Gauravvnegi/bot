import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoutes = {
  library: { label: 'Library', link: './' },
  template: { label: 'Template', link: '/pages/library/template' },
  createTemplate: { label: 'Create Template', link: './' },
  editTemplate: { label: 'Edit Template', link: './' },
};

export const templateRoutes: Record<
  'template' | 'createTemplate' | 'editTemplate',
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
    route: 'edit-template/:id',
    navRoutes: [navRoutes.editTemplate],
    title: '',
  },
};
