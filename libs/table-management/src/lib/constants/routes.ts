import { PageRoutes } from '@hospitality-bot/admin/shared';
import {
  ManageTablePages,
  TableFormSubmissionType,
  TableManagementDatableTabs,
} from '../types/table-datable.type';
export const tableManagementParmId: Record<
  TableManagementDatableTabs,
  string
> = {
  AREA: 'areaId',
  TABLE: 'tableId',
};

export const navRoutes: Record<
  ManageTablePages,
  { label: string; link: string }
> = {
  createTable: {
    label: 'Create Table',
    link: './',
  },
  createMultipleTable: {
    label: 'Create Multiple Table',
    link: './',
  },
  editable: {
    label: 'Edit Table',
    link: './',
  },
  createArea: {
    label: 'Create Area',
    link: './',
  },
  editArea: { label: 'Edit Area', link: './' },
};

export const tableManagementRoutes: Record<ManageTablePages, PageRoutes> = {
  createTable: {
    route: 'create-table',
    navRoutes: [navRoutes.createTable],
    title: 'Create Table',
  },
  editable: {
    route: `create-table/:${tableManagementParmId.TABLE}`,
    navRoutes: [navRoutes.editable],
    title: 'Edit Table',
  },
  createMultipleTable: {
    route: 'create-table',
    navRoutes: [navRoutes.createMultipleTable],
    title: 'Create Multiple Table',
  },
  createArea: {
    route: 'create-area',
    navRoutes: [navRoutes.createArea],
    title: 'Create Area',
  },
  editArea: {
    route: `create-area/:${tableManagementParmId.AREA}`,
    navRoutes: [navRoutes.editArea],
    title: 'Edit Area',
  },
};
