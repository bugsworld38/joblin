import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RefreshTokenRepository } from '@refresh-token';
import { UserRepository } from '@user';
import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import { RegisterRequestDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
    private refreshTokenRepo: RefreshTokenRepository,
  ) {}

  async register(registerDto: RegisterRequestDto) {
    const existingUser = await this.userRepo.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const createdUser = await this.userRepo.create({
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
      await this.refreshTokenRepo.findByTokenHash(tokenHash);

    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedRefreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token is compromised');
    }

    if (new Date() > new Date(storedRefreshToken.expiresAt)) {
      throw new UnauthorizedException('Refresh token is expired');
    }

    await this.refreshTokenRepo.revoke(storedRefreshToken.tokenHash);

    return this.generateTokens(storedRefreshToken.userId);
  }

  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '30d' });
    const refreshToken = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepo.create({ userId, tokenHash, expiresAt });

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.refreshTokenRepo.revoke(tokenHash);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

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
