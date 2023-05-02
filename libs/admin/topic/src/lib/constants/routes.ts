import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoutes = {
  library: { label: 'Library', link: './' },
  topic: { label: 'Topic', link: '/pages/library/topic' },
  createTopic: { label: 'Create Topic', link: './' },
  editTopic: { label: 'Edit Topic', link: './' },
};

export const TopicRoutes: Record<
  'topic' | 'createTopic' | 'editTopic',
  PageRoutes
> = {
  topic: {
    route: '',
    navRoutes: [],
    title: 'topic',
  },
  createTopic: {
    route: 'create-topic',
    navRoutes: [navRoutes.library, navRoutes.topic, navRoutes.createTopic],
    title: 'Create Topic',
  },
  editTopic: {
    route: 'create-topic/:id',
    navRoutes: [navRoutes.library, navRoutes.topic, navRoutes.editTopic],
    title: 'Edit Topic',
  },
};
