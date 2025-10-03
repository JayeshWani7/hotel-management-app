import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserInput, LoginUserInput } from '../users/dto/user.input';
import { AuthResponse } from './dto/auth-response.type';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserInput: RegisterUserInput): Promise<AuthResponse> {
    const user = await this.usersService.create(registerUserInput);
    const accessToken = this.generateToken(user);

    return { accessToken, user };
  }

  async login(loginUserInput: LoginUserInput): Promise<AuthResponse> {
    const user = await this.usersService.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateToken(user);

    return { accessToken, user };
  }

  async validateUserById(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}