import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '@refresh-token';
import type { User } from '@user/interfaces';
import { UserRepository } from '@user';

import { AuthService } from '../auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: UserRepository;
  let refreshTokenRepo: RefreshTokenRepository;
  let jwtService: JwtService;

  const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockRefreshTokenRepo = {
    create: jest.fn(),
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
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: RefreshTokenRepository, useValue: mockRefreshTokenRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<UserRepository>(UserRepository);
    refreshTokenRepo = module.get<RefreshTokenRepository>(RefreshTokenRepository);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = { email: 'test@example.com', password: 'password123' };

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should successfully register a user and return tokens', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      mockUserRepo.create.mockResolvedValue(mockUser);
      mockRefreshTokenRepo.create.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(userRepo.create).toHaveBeenCalledWith({
        email: registerDto.email,
        passwordHash: 'new_hashed_password',
      });
      expect(refreshTokenRepo.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login', () => {
    it('should generate and return tokens', async () => {
      mockRefreshTokenRepo.create.mockResolvedValue({});

      const result = await service.login(mockUser.id);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(refreshTokenRepo.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('validateUser', () => {
    it('should throw BadRequestException if user not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser('wrong@email.com', 'pass')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(mockUser.email, 'wrongpass')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return user if credentials are valid', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'password123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('refresh', () => {
    const incomingRefreshToken = 'some_hex_string';

    it('should throw UnauthorizedException if token not found in DB', async () => {
      mockRefreshTokenRepo.findByTokenHash.mockResolvedValue(null);

      await expect(service.refresh(incomingRefreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is revoked', async () => {
      mockRefreshTokenRepo.findByTokenHash.mockResolvedValue({ isRevoked: true });

      await expect(service.refresh(incomingRefreshToken)).rejects.toThrow(
        'Refresh token is compromised',
      );
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      mockRefreshTokenRepo.findByTokenHash.mockResolvedValue({
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

      mockRefreshTokenRepo.findByTokenHash.mockResolvedValue(storedToken);
      mockRefreshTokenRepo.create.mockResolvedValue({});

      const result = await service.refresh(incomingRefreshToken);

      expect(refreshTokenRepo.revoke).toHaveBeenCalledWith(storedToken.tokenHash);
      expect(refreshTokenRepo.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('logout', () => {
    it('should revoke the token', async () => {
      await service.logout('some_refresh_token');
      expect(refreshTokenRepo.revoke).toHaveBeenCalled();
    });
  });
});
