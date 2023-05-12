import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  library: { label: 'Library', link: './' },
  listing: { label: 'Listing', link: '/pages/library/listing' },
  createListing: { label: 'Create List', link: './' },
  editListing: { label: 'Edit List', link: './' },
};

export const listingRoutes: Record<
  'listing' | 'createListing' | 'editListing',
  PageRoutes
> = {
  listing: {
    route: '',
    navRoutes: [],
    title: 'Listing',
  },
  createListing: {
    route: 'create-listing',
    navRoutes: [navRoute.library, navRoute.listing, navRoute.createListing],
    title: 'Create Listing',
  },
  editListing: {
    route: 'edit-listing/:id',
    navRoutes: [navRoute.library, navRoute.listing, navRoute.editListing],
    title: 'Edit Listing',
  },
};
