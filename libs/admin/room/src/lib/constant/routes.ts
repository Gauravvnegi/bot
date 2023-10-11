const roomRoutes = {
  dashboard: '',
  addRoom: 'add-room',
  addSingleRoom: 'add-room/single',
  addMultipleRoom: 'add-room/multiple',
  editRoomType: 'add-room-type/:id',
  addRoomType: 'add-room-type',
  services: 'services',
  createService: 'create-service',
  importServices: 'import-services',
};

export const navRoutesConfig = {
  addRoomType: {
    label: 'Add Room Type',
    link: roomRoutes.addRoomType,
  },
};
//---- refactor--- add navigation route

export default roomRoutes;
