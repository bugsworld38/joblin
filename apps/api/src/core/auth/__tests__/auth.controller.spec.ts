import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Request, Response } from 'express';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = { id: '1', email: 'test@test.com' };
  const mockTokens = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and set a cookie', async () => {
      mockAuthService.register.mockResolvedValue(mockTokens);
      const dto = { email: 'test@test.com', password: 'password' };

      const result = await controller.register(mockResponse, dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.any(Object),
      );
      expect(result).toEqual({ accessToken: mockTokens.accessToken });
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      mockAuthService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(mockUser as any, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(mockUser.id);
      expect(mockResponse.cookie).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: mockTokens.accessToken });
    });
  });

  describe('logout', () => {
    it('should clear the cookie and call logout service', async () => {
      const mockRequest = {
        cookies: { refreshToken: 'old_token' },
      } as unknown as Request;

      await controller.logout(mockRequest, mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(authService.logout).toHaveBeenCalledWith('old_token');
    });

    it('should throw UnauthorizedException if no refresh token is present', async () => {
      const mockRequest = { cookies: {} } as unknown as Request;

      await expect(
        controller.logout(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens using the cookie', async () => {
      const mockRequest = {
        cookies: { refreshToken: 'old_token' },
      } as unknown as Request;
      mockAuthService.refresh.mockResolvedValue(mockTokens);

      const result = await controller.refresh(mockRequest, mockResponse);

      expect(authService.refresh).toHaveBeenCalledWith('old_token');
      expect(mockResponse.cookie).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: mockTokens.accessToken });
    });
  });

  describe('getMe', () => {
    it('should return the current user', () => {
      const result = controller.getMe(mockUser as any);
      expect(result).toEqual(mockUser);
    });
  });
});
