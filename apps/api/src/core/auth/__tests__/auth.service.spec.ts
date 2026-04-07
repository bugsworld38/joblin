import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import * as bcrypt from 'bcrypt';

import { RefreshTokensService } from '@modules/refresh-tokens/refresh-tokens.service';
import type { User } from '@modules/users/interfaces';
import { UsersService } from '@modules/users/users.service';

import { AuthService } from '../auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let refreshTokensService: RefreshTokensService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockRefreshTokensService = {
    save: jest.fn(),
    findByTokenHash: jest.fn(),
    revoke: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test_access_token'),
  };

  const mockUser: User = {
    id: 'user_id',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: RefreshTokensService, useValue: mockRefreshTokensService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    refreshTokensService =
      module.get<RefreshTokensService>(RefreshTokensService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = { email: 'test@example.com', password: 'password123' };

    it('should throw ConflictException if user already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should successfully register a user and return tokens', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        passwordHash: 'new_hashed_password',
      });
      expect(refreshTokensService.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login', () => {
    it('should generate and return tokens', async () => {
      const result = await service.login(mockUser.id);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(refreshTokensService.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('wrong@email.com', 'pass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser(mockUser.email, 'wrongpass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user if credentials are valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'password123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('refresh', () => {
    const incomingRefreshToken = 'some_hex_string';

    it('should throw UnauthorizedException if token not found in DB', async () => {
      mockRefreshTokensService.findByTokenHash.mockResolvedValue(null);

      await expect(service.refresh(incomingRefreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is revoked', async () => {
      mockRefreshTokensService.findByTokenHash.mockResolvedValue({
        isRevoked: true,
      });

      await expect(service.refresh(incomingRefreshToken)).rejects.toThrow(
        'Refresh token is compromised',
      );
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      mockRefreshTokensService.findByTokenHash.mockResolvedValue({
        isRevoked: false,
        expiresAt: pastDate,
      });

      await expect(service.refresh(incomingRefreshToken)).rejects.toThrow(
        'Refresh token is expired',
      );
    });

    it('should work if token is valid: revoke old, generate new', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const storedToken = {
        userId: 'user_id',
        tokenHash: 'old_hash',
        isRevoked: false,
        expiresAt: futureDate,
      };

      mockRefreshTokensService.findByTokenHash.mockResolvedValue(storedToken);

      const result = await service.refresh(incomingRefreshToken);

      expect(refreshTokensService.revoke).toHaveBeenCalledWith(
        storedToken.tokenHash,
      );
      expect(refreshTokensService.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('logout', () => {
    it('should revoke the token', async () => {
      await service.logout('some_refresh_token');
      expect(refreshTokensService.revoke).toHaveBeenCalled();
    });
  });
});
