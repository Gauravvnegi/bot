export const sharedConfig = {
  timeInterval: {
    date: 'date',
    week: 'week',
    month: 'month',
  },
  defaultOrder: 'DESC',
  img: {
    upArrow: {
      url: 'assets/svg/uparrow.svg',
      alt: 'uparrow',
    },
    downArrow: {
      url: 'assets/svg/down-percentage.svg',
      alt: 'down-percentage',
    },
  },
};

export const fileUploadConfiguration = {
  image: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  video: ['mp4', 'MPEG', 'MOV', 'AVI', 'MKV'],
  docs: ['pdf', 'csv'],
};

export enum RoomStatsImgUrls {
  RemainingInventoryCost = 'assets/svg/remaining-inventory-cost.svg',
  InventoryRemaining = 'assets/svg/inventory-remaining.svg',
  Occupancy = 'assets/svg/occupancy.svg',
  AverageRoomRate = 'assets/svg/avg-room-rate.svg',
}

export enum DiscountType {
  PERCENTAGE = '%OFF',
  NUMBER = 'Flat',
}
