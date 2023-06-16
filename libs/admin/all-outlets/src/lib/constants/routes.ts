import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  allOutlets: { label: 'AllOutlets', link: '/pages/outlet/all-outlets' },
  addOutlet: { label: 'Add Outlet', link: '/pages/outlet/all-outlets/add-outlet' },
  editOutlet: { label: 'Edit Outlet', link: '/pages/outlet/all-outlets/edit-outlet' },
  addMenu1: { label: 'Add Menu', link: '/pages/outlet/all-outlets/add-outlet/add-menu' },
  addMenu2: {
    label: 'Add Menu',
    link: '/pages/outlet/all-outlets/edit-outlet/:outletId/add-menu',
  },
  editMenu1: {
    label: 'Edit Menu',
    link: '/pages/outlet/all-outlets/add-outlet/edit-menu/:menuId',
  },
  editMenu2: {
    label: 'Edit Menu',
    link: '/pages/outlet/all-outlets/add-outlet/:outletId/edit-menu/:menuId',
  },
  createFoodPackage1: {
    label: 'Create Food Package',
    link: '/pages/outlet/all-outlets/add-outlet/create-food-package',
  },
  createFoodPackage2: {
    label: 'Create Food Package',
    link: '/pages/outlet/all-outlets/edit-outlet/:outletId/create-food-package',
  },
  editFoodPackage1: {
    label: 'Edit Food Package',
    link: '/pages/outlet/all-outlets/add-outlet/edit-food-package/:foodPackageId',
  },
  editFoodPackage2: {
    label: 'Edit Food Package',
    link: '/pages/outlet/all-outlets/edit-outlet/:outletId/edit-food-package/:foodPackageId',
  },
  addMenuItem1: {
    label: 'Add Menu Item',
    link: '/pages/outlet/all-outlets/add-outlet/add-menu/add-menu-item',
  },
  addMenuItem2: {
    label: 'Add Menu Item',
    link: '/pages/outlet/all-outlets/add-outlet/edit-menu/:menuId/add-menu-item',
  },
  addMenuItem3: {
    label: 'Add Menu Item',
    link: '/pages/outlet/all-outlets/edit-outlet/:outletId/add-menu/add-menu-item',
  },
  addMenuItem4: {
    label: 'Add Menu Item',
    link: '/pages/outlet/all-outlets/edit-outlet/:outletId/edit-menu/:menuId/add-menu-item',
  },
  editMenuItem1: {
    label: 'Edit Menu Item',
    link: '/pages/outlet/all-outlets/add-outlet/edit-menu/:menuId/edit-menu-item/:menuItemId',
  },
  editMenuItem2: {
    label: 'Edit Menu Item',
    link: '/pages/outlet/all-outlets/edit-outlet/:outletId/edit-menu/:menuId/edit-menu-item/:menuItemId',
  },
};

// export const navRoute = {
//   outlet: { label: 'Outlet', link: './' },
//   allOutlets: { label: 'All Outlets', link: '/pages/outlets' },
//   addOutlet: {
//     label: 'Add Outlet',
//     link: '/pages/outlets/all-outlets/add-outlet',
//   },
//   editOutlet: { label: 'Edit Outlet', link: './' },
//   addMenu: { label: 'Add Menu', link: './' },
//   editMenu: { label: 'Edit Menu', link: './' },
//   addMenuItem: { label: 'Add Menu Item', link: './' },
//   editMenuItem: { label: 'Edit Menu Item', link: './' },
//   menuList: { label: 'Menu List', link: './' },
//   createFoodPackage: { label: 'Create Food Package', link: './' },
//   editFoodPackage: {label: 'Edit Food Package', link: './'}
// };

export const outletRoutes: Record<
  | 'allOutlets'
  | 'addOutlet'
  | 'editOutlet'
  | 'addMenu1'
  | 'addMenu2'
  | 'editMenu1'
  | 'editMenu2'
  | 'addMenuItem1'
  | 'addMenuItem2'
  | 'addMenuItem3'
  | 'addMenuItem4'
  | 'editMenuItem1'
  | 'editMenuItem2'
  | 'createFoodPackage1'
  | 'createFoodPackage2'
  | 'editFoodPackage1'
  | 'editFoodPackage2',
  PageRoutes
> = {
  allOutlets: {
    route: 'all-outlets',
    navRoutes: [navRoute.allOutlets],
    title: 'All Outlets',
  },
  addOutlet: {
    route: 'add-outlet',
    navRoutes: [navRoute.allOutlets, navRoute.addOutlet],
    title: 'Add Outlet',
  },
  editOutlet: {
    route: 'edit-outlet/:outletId',
    navRoutes: [navRoute.allOutlets, navRoute.editOutlet],
    title: 'Edit Outlet',
  },
  addMenu1: {
    route: 'add-menu',
    navRoutes: [navRoute.allOutlets, navRoute.addOutlet, navRoute.addMenu1],
    title: 'Add Menu',
  },
  addMenu2: {
    route: 'add-menu',
    navRoutes: [navRoute.allOutlets, navRoute.editOutlet, navRoute.addMenu2],
    title: 'Add Menu',
  },
  editMenu1: {
    route: 'edit-menu/:menuId',
    navRoutes: [navRoute.allOutlets, navRoute.addOutlet, navRoute.editMenu1],
    title: 'Edit Menu',
  },
  editMenu2: {
    route: 'edit-menu/:menuId',
    navRoutes: [navRoute.allOutlets, navRoute.addOutlet, navRoute.editMenu2],
    title: 'Edit Menu',
  },
  addMenuItem1: {
    route: 'add-menu-item',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.addOutlet,
      navRoute.addMenu1,
      navRoute.addMenuItem1,
    ],
    title: 'Add Menu Item',
  },
  addMenuItem2: {
    route: 'add-menu-item',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.addOutlet,
      navRoute.editMenu1,
      navRoute.addMenuItem2,
    ],
    title: 'Add Menu Item',
  },
  addMenuItem3: {
    route: 'add-menu-item',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.editOutlet,
      navRoute.addMenu2,
      navRoute.addMenuItem3,
    ],
    title: 'Add Menu Item',
  },
  addMenuItem4: {
    route: 'add-menu-item',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.editOutlet,
      navRoute.editMenu2,
      navRoute.addMenuItem4,
    ],
    title: 'Add Menu Item',
  },
  editMenuItem1: {
    route: 'edit-menu-item/:menuItemId',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.addOutlet,
      navRoute.editMenu1,
      navRoute.editMenuItem1,
    ],
    title: 'Edit Menu Item',
  },
  editMenuItem2: {
    route: 'edit-menu-item/:menuItemId',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.editOutlet,
      navRoute.editMenu2,
      navRoute.editMenuItem2,
    ],
    title: 'Edit Menu Item',
  },
  createFoodPackage1: {
    route: 'create-food-package',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.addOutlet,
      navRoute.createFoodPackage1,
    ],
    title: 'Create Food Package',
  },
  createFoodPackage2: {
    route: 'create-food-package',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.editOutlet,
      navRoute.createFoodPackage2,
    ],
    title: 'Create Food Package',
  },
  editFoodPackage1: {
    route: 'edit-food-package/:foodPackageId',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.addOutlet,
      navRoute.editFoodPackage1,
    ],
    title: 'Edit Food Package',
  },
  editFoodPackage2: {
    route: 'edit-food-package/:foodPackageId',
    navRoutes: [
      navRoute.allOutlets,
      navRoute.editOutlet,
      navRoute.editFoodPackage2,
    ],
    title: 'Edit Food Package',
  },
};

