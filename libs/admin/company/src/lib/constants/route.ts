import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
    company: {label: 'Company', link: 'pages/members/compnay'},
    addCompany: {label: 'Add Company', link: './'},
};


export const companyRoutes: Record<'company' | 'addCompany', PageRoutes> = {
    company: {
        route: '',
        navRoutes: [],
        title: 'Company'
    },
    addCompany: {
        route: 'add-company',
        navRoutes: [navRoute.company, navRoute.addCompany],
        title: 'Add Company'
    }
}