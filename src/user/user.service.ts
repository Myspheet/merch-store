import { Injectable } from '@nestjs/common';

export type Tenant = any;

@Injectable()
export class UserService {
  private readonly tenants = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<Tenant | undefined> {
    return this.tenants.find(tenant => tenant.username === username);
  }
}
