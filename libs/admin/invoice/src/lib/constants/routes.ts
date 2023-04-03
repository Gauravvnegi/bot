import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: './' },
  reservation: { label: 'Reservation', link: '/pages/efrontdesk/reservation' },
  addReservation: { label: 'Create Reservation', link: './' },
  editReservation: { label: 'Edit Reservation', link: './' },
  invoice: { label: 'Invoice', link: './' },
};

export const invoiceRoutes: Record<
  'createInvoice' | 'editInvoice' | 'previewInvoice',
  PageRoutes
> = {
  createInvoice: {
    route: 'create-invoice',
    navRoutes: [],
    title: 'Invoice',
  },

  editInvoice: {
    route: 'edit-invoice',
    navRoutes: [],
    title: 'Edit Invoice',
  },

  previewInvoice: {
    route: 'preview-invoice',
    navRoutes: [],
    title: 'Preview Invoice',
  },
};
