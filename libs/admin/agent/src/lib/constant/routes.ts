import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
  agent: { label: 'Agent', link: '/pages/members/' },
  addAgent: { label: 'Add Agent', link: './' },
  editAgent: { label: 'Edit Agent', link: './' },
};

export const agentRoutes: Record<
  'addAgent' | 'editAgent' | 'agent',
  PageRoutes
> = {
  agent: {
    route: '',
    navRoutes: [navRoute.agent],
    title: 'Agent',
  },
  addAgent: {
    route: 'add-agent',
    navRoutes: [navRoute.agent, navRoute.addAgent],
    title: 'Add Agent',
  },
  editAgent: {
    route: 'add-agent',
    navRoutes: [navRoute.agent, navRoute.editAgent],
    title: 'Edit Agent',
  },
};
