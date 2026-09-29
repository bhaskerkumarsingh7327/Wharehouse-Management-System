import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash,
      roleName: dto.role,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: {
    id: number;
    name: string;
    email: string;
    role: { name: string };
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = this.jwtService.sign(payload);

const refreshToken = this.jwtService.sign(payload, {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as StringValue,
});

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      accessToken,
      refreshToken,
    };
  }
}