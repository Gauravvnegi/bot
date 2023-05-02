import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoutes = {
  library: { label: 'Library', link: './' },
  assets: { label: 'Assets', link: 'pages/libaray/assets' },
  createAssets: { label: 'Create Assets', link: './' },
  editAssets: { label: 'Edit Assets', link: './' },
};

export const AssetsRoutes: Record<
  'assets' | 'createAssets' | 'editAssets',
  PageRoutes
> = {
  assets: {
    route: '',
    navRoutes: [],
    title: 'Assets',
  },
  createAssets: {
    route: 'create-asset',
    navRoutes: [navRoutes.library, navRoutes.assets, navRoutes.createAssets],
    title: 'Create Assets',
  },
  editAssets: {
    route: 'edit-asset/:id',
    navRoutes: [navRoutes.library, navRoutes.assets, navRoutes.editAssets],
    title: 'Edit Assets',
  },
};
