import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) ?? 3306,
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'stocksense',
      connectionLimit: 5,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect(); 
  }
}