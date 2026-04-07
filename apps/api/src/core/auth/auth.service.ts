import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import { RefreshTokensService } from '@modules/refresh-tokens/refresh-tokens.service';
import { UsersService } from '@modules/users/users.service';

import { RegisterRequestDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private refreshTokensService: RefreshTokensService,
  ) {}

  async register(registerDto: RegisterRequestDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const createdUser = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
    });

    return this.generateTokens(createdUser.id);
  }

  async login(userId: string) {
    return this.generateTokens(userId);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);

    const storedRefreshToken =
      await this.refreshTokensService.findByTokenHash(tokenHash);

    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedRefreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token is compromised');
    }

    if (new Date() > new Date(storedRefreshToken.expiresAt)) {
      throw new UnauthorizedException('Refresh token is expired');
    }

    await this.refreshTokensService.revoke(storedRefreshToken.tokenHash);

    return this.generateTokens(storedRefreshToken.userId);
  }

  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '15m' });
    const refreshToken = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokensService.save({ userId, tokenHash, expiresAt });

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.refreshTokensService.revoke(tokenHash);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException('Email or password is incorrect');
    }

    return user;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
