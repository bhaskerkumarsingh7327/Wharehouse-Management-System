import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    roleName: string;
  }) {
    const role = await this.prisma.role.findUnique({
      where: { name: data.roleName as any },
    });

    if (!role) {
      throw new Error(`Role ${data.roleName} does not exist`);
    }

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: role.id,
      },
      include: { role: true },
    });
  }
}