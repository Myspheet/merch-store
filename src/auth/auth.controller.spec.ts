import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    refreshToken: jest.fn(),
    handleGoogleRedirect: jest.fn(),
    verifyToken: jest.fn(),
    logout: jest.fn(),
  }

  const tenant = {
    id: 6,
    email: "jane@gmail.com",
    name: "Jane Doe",
    phone_number: null,
    signin_provider: null,
    refresh_token: null,
    photo_url: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: mockAuthService
      }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should signup tenant', async () => {
    const createTenantDto = {
      email: "jane@gmail.com",
      name: "Jane Doe",
      password: "helloworld"
    };

    jest.spyOn(mockAuthService, 'signUp').mockReturnValue(tenant);

    const result = await controller.signUp(createTenantDto);

    expect(mockAuthService.signUp).toHaveBeenCalled();
    expect(mockAuthService.signUp).toHaveBeenCalledWith(createTenantDto);

    expect(result).toEqual(tenant);
  });

  it('should signin tenant', async () => {
    const createTenantDto = {
      email: "jane@gmail.com",
      password: "helloworld"
    };

    const tokens = {
      accessToke: "random string",
      refreshTOken: "random string 2"
    };

    jest.spyOn(mockAuthService, 'signIn').mockReturnValue(tokens);

    const result = await controller.signIn(createTenantDto);

    expect(mockAuthService.signIn).toHaveBeenCalled();
    expect(mockAuthService.signIn).toHaveBeenCalledWith(createTenantDto);

    expect(result).toEqual(tokens);
  });

  it('should call refresh-token', async () => {
    const refreshTokenDto = { refresh_token: "hello world" };

    const tokens = {
      accessToke: "random string",
      refreshTOken: "random string 2"
    };

    const user = { accessToken: 'hellow world' };

    jest.spyOn(mockAuthService, 'refreshToken').mockReturnValue(tokens);

    const result = await controller.refreshToken(refreshTokenDto, user);

    expect(mockAuthService.refreshToken).toHaveBeenCalled();
    expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refresh_token, user);

    expect(result).toEqual(tokens);
  });

  it('should handle redirect after google signing', async () => {
    const req = {
      user: {}
    };

    const tokens = {
      accessToke: "random string",
      refreshTOken: "random string 2"
    };

    jest.spyOn(mockAuthService, 'handleGoogleRedirect').mockReturnValue(tokens);

    const result = await controller.handlerRedirect(req);

    expect(mockAuthService.handleGoogleRedirect).toHaveBeenCalled();
    expect(mockAuthService.handleGoogleRedirect).toHaveBeenCalledWith(req.user);

    expect(result).toEqual(tokens);
  });

  it('should verify the token', async () => {
    const req = {
      headers: {
        'authorization': 'Bearer helloworld'
      }
    };

    const user = {};

    const tokens = {
      accessToke: "random string",
      refreshTOken: "random string 2"
    };

    jest.spyOn(mockAuthService, 'verifyToken').mockReturnValue(tokens);

    const result = await controller.verifyToken(tenant, req);

    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockAuthService.verifyToken).toHaveBeenCalledWith(tenant, 'helloworld');

    expect(result).toEqual(tokens);
  });

  it('should logout a tenant', async () => {
    const req = {
      headers: {
        'authorization': 'Bearer helloworld'
      }
    };

    const user = {};

    const returnVal = {
      message: "Logout Successfully",
    };

    jest.spyOn(mockAuthService, 'logout').mockReturnValue(returnVal);

    const result = await controller.logout(req);

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalledWith('helloworld');

    expect(result).toEqual(returnVal);
  });

});