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
  image: ['png', 'jpg', 'jpeg', 'gif', 'eps', 'webp'],
  video: ['mp4', 'MPEG', 'MOV', 'AVI', 'MKV'],
  docs: ['pdf', 'csv'],
};

export enum StatCardImageUrls {
  RemainingInventoryCost = 'assets/svg/remaining-inventory-cost.svg',
  InventoryRemaining = 'assets/svg/inventory-remaining.svg',
  Occupancy = 'assets/svg/occupancy.svg',
  AverageRoomRate = 'assets/svg/avg-room-rate.svg',
  Total = 'assets/svg/total.svg',
  ToDo = 'assets/svg/todo.svg',
  Resolved = 'assets/svg/resolved.svg',
  Timedout = 'assets/svg/timedout.svg',
  SellsGraph = 'assets/svg/avg-room-rate.svg',
  TotalOrders = 'assets/svg/remaining-inventory-cost.svg',
  InProgress = 'assets/svg/in-progress.svg',
  AverageTicket = 'assets/svg/tickets.svg',
  AverageTime = 'assets/svg/time-taken.svg',
  Agent = 'assets/svg/agent.svg',
}

export enum DiscountType {
  PERCENTAGE = '%OFF',
  FLAT = 'Flat',
}
