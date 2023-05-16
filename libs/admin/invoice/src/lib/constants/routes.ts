import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  eFrontdesk: { label: 'eFrontdesk', link: '/pages/efrontdesk' },
  addReservation: { label: 'Create Reservation', link: './' },
  editReservation: { label: 'Edit Reservation', link: './' },
  invoice: { label: 'Invoice', link: '/pages/efrontdesk/invoice' },
  createInvoice: { label: 'Create Invoice', link: './' },
  previewInvoice: { label: 'Preview Invoice', link: '././invoice/:id'},
  paymentHistory: { label: 'Payment History', link: './'},
};

export const invoiceRoutes: Record<
  'invoice' | 'editInvoice' | 'previewInvoice' | 'paymentHistory',
  PageRoutes
> = {
  invoice: {
    route: 'invoice/:id',
    navRoutes: [navRoute.eFrontdesk, navRoute.invoice],
    title: 'Manage Invoice',
  },

  editInvoice: {
    route: 'edit-invoice',
    navRoutes: [],
    title: 'Edit Invoice',
  },

  previewInvoice: {
    route: 'preview-invoice',
    navRoutes: [navRoute.eFrontdesk, navRoute.invoice, navRoute.previewInvoice],
    title: 'Preview Invoice',
  },

  paymentHistory: {
    route: 'payment-history',
    navRoutes: [navRoute.eFrontdesk, navRoute.invoice, navRoute.paymentHistory],
    title: 'Payment History',    
  }
};
