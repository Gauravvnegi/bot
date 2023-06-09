import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  company: { label: 'Company', link: '/pages/members/company' },
  addCompany: { label: 'Add Company', link: './' },
  editCompany: { label: 'Edit Company', link: './' },
};

export const companyRoutes: Record<
  'company' | 'addCompany' | 'editCompany',
  PageRoutes
> = {
  company: {
    route: '',
    navRoutes: [],
    title: 'Company',
  },
  addCompany: {
    route: 'add-company',
    navRoutes: [navRoute.company, navRoute.addCompany],
    title: 'Add Company',
  },
  editCompany: {
    route: 'edit-company',
    navRoutes: [navRoute.company, navRoute.editCompany],
    title: 'Edit Company',
  },
};
