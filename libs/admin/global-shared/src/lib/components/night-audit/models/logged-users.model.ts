import { User } from 'libs/admin/roles-and-permissions/src/lib/models/user-permission-table.model';
import {
  TableDataType,
  TableViewDataType,
} from '../../../types/table-view.type';
export class LoggedInUsers implements TableViewDataType {
  [key: string]: TableDataType;
  constructor(input: User) {
    this['name'] = input.firstName + input.lastName;
    this['department'] = input['department']; // TODO: Need to change, data not coming from api
    this['contact'] = {
      phoneNumber: input.phoneNumber,
      email: input.email,
    };
    this['jobTitle'] = input.jobTitle;
  }
}
