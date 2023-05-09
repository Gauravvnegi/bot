
import { PageRoutes } from '@hospitality-bot/admin/shared';

export const navRoute = {
         settings: { label: 'Settings', link: '/pages/settings' },
         brand: { label: 'Brand', link: '/pages/settings/business-info/brand' },
         hotel: { label: 'Hotel', link: '/pages/settings/business-info/hotel' },
         editBrand: { label: 'Edit Brand', link: './' },
         bussinessInfo: {
           label: 'Business Info',
           link: '/pages/settings/business-info',
         },
         editHotel: { label: 'Edit Hotel', link: './' },
       };

export const businessRoute: Record<
         'brand' | 'editBrand' | 'hotel' | 'editHotel',
         PageRoutes
       > = {
         brand: {
           route: '',
           navRoutes: [
             navRoute.settings,
             navRoute.bussinessInfo,
             navRoute.brand,
           ],
           title: 'Brand',
         },
         editBrand: {
           route: ':brandId',
           navRoutes: [
             navRoute.settings,
             navRoute.bussinessInfo,
             navRoute.editBrand,
           ],
           title: 'Edit Brand',
         },
         hotel: {
           route: 'hotel',
           navRoutes: [
             navRoute.settings,
             navRoute.bussinessInfo,
             navRoute.editBrand,
             navRoute.hotel,
           ],
           title: 'Hotel',
         },
         editHotel: {
           route: ':hotelId',
           navRoutes: [
             navRoute.settings,
             navRoute.bussinessInfo,
             navRoute.editBrand,
             navRoute.editHotel,
           ],
           title: 'Edit Hotel',
         },
       };
