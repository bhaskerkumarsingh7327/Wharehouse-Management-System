import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export enum SignupRole {
  INVENTORY_MANAGER = 'INVENTORY_MANAGER',
  WAREHOUSE_STAFF = 'WAREHOUSE_STAFF',
}

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsEnum(SignupRole)
  role: SignupRole;
}