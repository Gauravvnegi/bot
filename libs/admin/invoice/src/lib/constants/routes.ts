import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: './' },
  reservation: { label: 'Reservation', link: '/pages/efrontdesk/reservation' },
  addReservation: { label: 'Create Reservation', link: './' },
  editReservation: { label: 'Edit Reservation', link: './' },
  invoice: { label: 'Invoice', link: './' },
  createInvoice: { label: 'Create Invoice', link: './' },
  previewInvoice: { label: 'Preview Invoice', link: './invoice/create-invoice/:id'},
  paymentHistory: { label: 'Payment History', link: './'},
};

export const invoiceRoutes: Record<
  'createInvoice' | 'editInvoice' | 'previewInvoice' | 'paymentHistory',
  PageRoutes
> = {
  createInvoice: {
    route: 'create-invoice',
    navRoutes: [navRoute.eFrontdesk, navRoute.invoice, navRoute.createInvoice],
    title: 'Create Invoice',
  },

  editInvoice: {
    route: 'edit-invoice',
    navRoutes: [],
    title: 'Edit Invoice',
  },

  previewInvoice: {
    route: 'preview-invoice',
    navRoutes: [navRoute.eFrontdesk, navRoute.invoice, navRoute.createInvoice, navRoute.previewInvoice],
    title: 'Preview Invoice',
  },

  paymentHistory: {
    route: 'payment-history',
    navRoutes: [navRoute.eFrontdesk, navRoute.invoice, navRoute.paymentHistory],
    title: 'Payment History',    
  }
};
