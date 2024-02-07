import { NavRouteOption, PageRoutes } from '@hospitality-bot/admin/shared';
export const navRoutes: Record<
  ServiceItemPages | 'serviceItem',
  NavRouteOption
> = {
  serviceItem: { label: 'Service Items', link: './' },
  createServiceItem: { label: 'Create Service Item', link: './' },
  editServiceItem: { label: 'Edit Service Item', link: './' },
  manageCategory: {
    label: 'Mange Category',
    link: '/complaint-tracker/complaint-home/service-item/manage-category',
  },
  createCategory: {
    label: 'Create Category',
    link:
      '/complaint-tracker/complaint-home/service-item/manage-category/create-category',
  },
  editCategory: {
    label: 'Edit Category',
    link:
      '/complaint-tracker/complaint-home/service-item/manage-category/:categoryId',
  },
};

export const parmaId = {
  editServiceItem: 'serviceItemId',
  editCategory: 'categoryId',
};

export const serviceItemRoutes: Record<ServiceItemPages, PageRoutes> = {
  createServiceItem: {
    route: 'create-service-item',
    navRoutes: [navRoutes.createServiceItem],
    title: 'Create Service Item',
  },
  editServiceItem: {
    route: `create-service-item/:${parmaId.editServiceItem}`,
    navRoutes: [navRoutes.editServiceItem],
    title: 'Edit Service Item',
  },
  manageCategory: {
    route: 'manage-category',
    navRoutes: [navRoutes.manageCategory],
    title: 'Manage Category',
  },
  createCategory: {
    route: 'create-category',
    navRoutes: [navRoutes.manageCategory, navRoutes.createCategory],
    title: 'Create Category',
  },
  editCategory: {
    route: `create-category/:${parmaId.editCategory}`,
    navRoutes: [navRoutes.manageCategory, navRoutes.editCategory],
    title: 'Edit Category',
  },
};

type ServiceItemPages =
  | 'createServiceItem'
  | 'editServiceItem'
  | 'manageCategory'
  | 'createCategory'
  | 'editCategory';
