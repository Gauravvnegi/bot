import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: '/pages/efrontdesk' },
  addReservation: { label: 'Create Reservation', link: './' },
  editReservation: { label: 'Edit Reservation', link: './' },
  invoice: { label: 'Invoice', link: './' },
  createInvoice: { label: 'Create Invoice', link: './' },
  previewInvoice: { label: 'Preview Invoice', link: '././' },
  paymentHistory: { label: 'Payment History', link: './' },
  manageInvoice: { label: 'Manage Invoice', link: './' },
};

export const invoiceRoutes: Record<
  'invoice' | 'editInvoice' | 'previewInvoice' | 'paymentHistory',
  PageRoutes
> = {
  invoice: {
    route: '',
    navRoutes: [navRoute.manageInvoice],
    title: 'Manage Invoice',
  },

  editInvoice: {
    route: 'edit-invoice',
    navRoutes: [],
    title: 'Edit Invoice',
  },

  previewInvoice: {
    route: 'preview-invoice',
    navRoutes: [navRoute.previewInvoice],
    title: 'Preview Invoice',
  },

  paymentHistory: {
    route: 'payment-history',
    navRoutes: [navRoute.paymentHistory],
    title: 'Payment History',
  },
};
