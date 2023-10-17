const roomRoutes = {
  dashboard: '',
  addRoom: 'add-room',
  editRoom: 'add-room/:id',
  addSingleRoom: 'add-room/single',
  addMultipleRoom: 'add-room/multiple',
  editRoomType: ':roomTypeId',
  addRoomType: 'add-room-type',
  services: 'services',
  createService: 'create-service',
  importServices: 'import-services',
};

export const navRoutesConfig = {
  addRoomType: {
    label: 'Add Room Type',
    link: 'add-room-type',
  },
  addRoom: {
    label: 'Add Room',
    link: 'add-room',
  },
  addSingleRoom: {
    label: 'Add Single Room',
    link: roomRoutes.addSingleRoom,
  },
  addMultipleRoom: {
    label: 'Add Multiple Room',
    link: roomRoutes.addMultipleRoom,
  },
  editRoomType: {
    label: 'Edit Room Type',
    link: 'add-room-type/:roomTypeId',
  },
  editRoom: {
    label: 'Edit Room',
    link: roomRoutes.editRoom,
  },
  services: {
    label: 'Services',
    link: roomRoutes.services,
  },
  createService: {
    label: 'Create Service',
    link: roomRoutes.createService,
  },
  importServices: {
    label: 'Import Services',
    link: roomRoutes.importServices,
  },
};

export const roomRoutesConfig = {
  roomType: {
    route: roomRoutes.addRoomType,
    navRoutes: [navRoutesConfig.addRoomType],
    title: 'Add Room Type',
  },
  room: {
    route: roomRoutes.addRoom,
    navRoutes: [navRoutesConfig.addRoom],
    title: 'Add Room',
  },
  singleRoom: {
    route: roomRoutes.addSingleRoom,
    navRoutes: [navRoutesConfig.addSingleRoom],
    title: 'Add Single Room',
  },
  multipleRoom: {
    route: roomRoutes.addMultipleRoom,
    navRoutes: [navRoutesConfig.addMultipleRoom],
    title: 'Add Multiple Room',
  },
  editRoomType: {
    route: roomRoutes.editRoomType,
    navRoutes: [navRoutesConfig.editRoomType],
    title: 'Edit Room Type',
  },
  editRoom: {
    route: roomRoutes.editRoom,
    navRoutes: [navRoutesConfig.editRoom],
    title: 'Edit Room',
  },
  services: {
    route: roomRoutes.services,
    navRoutes: [navRoutesConfig.addRoomType, navRoutesConfig.services],
    title: 'Services',
  },
  editRoomTypeServices: {
    route: roomRoutes.services,
    navRoutes: [navRoutesConfig.editRoomType, navRoutesConfig.services],
    title: 'Services',
  }
  ,
  createService: {
    route: roomRoutes.createService,
    navRoutes: [navRoutesConfig.createService],
    title: 'Create Service',
  },
  importServices: {
    route: roomRoutes.importServices,
    navRoutes: [navRoutesConfig.addRoomType , navRoutesConfig.importServices],
    title: 'Import Services',
  },
  editRoomTypeImportServices: {
    route: roomRoutes.importServices,
    navRoutes: [navRoutesConfig.editRoomType, navRoutesConfig.importServices],
    title: 'Import Services',
  }
};
//---- refactor--- add navigation route

export default roomRoutes;
