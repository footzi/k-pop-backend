import { Injectable } from '@nestjs/common';
import USERS_DATA from '../../in-sales-response/clients.json';

interface IUser {
  email: string;
}

@Injectable()
export class UserService {
  private users: IUser[];

  constructor() {
    this.users = USERS_DATA;
  }

  hasUser(email: string): boolean {
    return !!this.users.find((user) => user.email === email);
  }
}
