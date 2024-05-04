import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/user.repository';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenRepository } from './repository/refreshToken.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockTenant = {
    email: "jane@gmail.com",
    name: "Jane Doe",
    phone_number: null,
    password: "hello world",
    signin_provider: null,
    refresh_token: null,
    photo_url: null,
  }

  const mockTenantWithoutPassword = {
    email: "jane@gmail.com",
    name: "Jane Doe",
    phone_number: null,
    signin_provider: null,
    refresh_token: null,
    photo_url: null,
  }

  const mockTenantRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    compare: jest.fn(),
    findById: jest.fn(),
  }

  const mockHashingService = {
    hash: jest.fn(),
    compare: jest.fn(),
  }

  const mockJwtService = {
    verifyAsync: jest.fn(),
    signIn: jest.fn(),
    handlerRedirect: jest.fn(),
    refreshToken: jest.fn(),
    signAsync: jest.fn(),
  }

  const mockJwtConfiguration = {

  }

  const mockRefreshTokenRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByRefreshToken: jest.fn(),
  }

  const tokens = {
    accessToken: "hello_world",
    refreshToken: "hello_world"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockTenantRepository
        },
        {
          provide: HashingService,
          useValue: mockHashingService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: RefreshTokenRepository,
          useValue: mockRefreshTokenRepository
        },
        {
          provide: "CONFIGURATION(jwt)",
          useValue: mockJwtConfiguration
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Validate Normal Tenant sign in', () => {
    it('should validate user sign in with email and password', async () => {
      const email = "jane@gmail.com";

      jest.spyOn(mockTenantRepository, 'findByEmail').mockReturnValue(mockTenant);

      const result = await service.validateUser(email, "hello world");

      expect(mockTenantRepository.findByEmail).toHaveBeenCalled();
      expect(mockTenantRepository.findByEmail).toHaveBeenCalledWith(email);

      expect(result).toEqual(mockTenantWithoutPassword);
    });

    it('should return null if password not found', async () => {
      const email = "jane@gmail.com";

      jest.spyOn(mockTenantRepository, 'findByEmail').mockReturnValue(mockTenant);

      const result = await service.validateUser(email, "hello worl");

      expect(mockTenantRepository.findByEmail).toHaveBeenCalled();
      expect(mockTenantRepository.findByEmail).toHaveBeenCalledWith(email);

      expect(result).toEqual(null);
    });

    it('should return null if user not found', async () => {
      const email = "jane@gmail.com";

      jest.spyOn(mockTenantRepository, 'findByEmail').mockReturnValue(null);

      const result = await service.validateUser(email, "hello worl");

      expect(mockTenantRepository.findByEmail).toHaveBeenCalled();
      expect(mockTenantRepository.findByEmail).toHaveBeenCalledWith(email);

      expect(result).toEqual(null);
    });

  });

  describe('Validate Google Sign in Tenant', () => {
    const profileDetails = {
      name: "Jane Doe",
      email: "jane@gmail.com",
      photo_url: "https://google.com/whatever",
      signin_provider: 'google'
    };

    const returnedTenant = {
      email: "jane@gmail.com",
      name: "Jane Doe",
      phone_number: null,
      signin_provider: "google",
      refresh_token: null,
      photo_url: "https://google.com/whatever",
    }

    it('should validate user sign in with google', async () => {
      jest.spyOn(mockTenantRepository, 'findByEmail').mockReturnValue(returnedTenant);

      const result = await service.validateGoogleUser(profileDetails);

      expect(mockTenantRepository.findByEmail).toHaveBeenCalled();
      expect(mockTenantRepository.findByEmail).toHaveBeenCalledWith(profileDetails.email);

      expect(result).toEqual(returnedTenant);
    });

    it('should create tenant if email not found', async () => {
      const email = "jane@gmail.com";

      jest.spyOn(mockTenantRepository, 'findByEmail').mockReturnValue(null);
      jest.spyOn(mockTenantRepository, 'create').mockReturnValue(returnedTenant);

      const result = await service.validateGoogleUser(profileDetails);

      expect(mockTenantRepository.findByEmail).toHaveBeenCalled();
      expect(mockTenantRepository.findByEmail).toHaveBeenCalledWith(email);

      expect(mockTenantRepository.create).toHaveBeenCalled()
      expect(mockTenantRepository.create).toHaveBeenCalledWith(profileDetails)

      expect(result).toEqual(returnedTenant);
    });
  });

  it('should create a new user', async () => {
    const signUpDto = {
      email: 'jane@gmail.com',
      password: "hello world",
      name: "Jane Doe",
    };

    const hashResult = "1234567";

    jest.spyOn(mockTenantRepository, 'create').mockReturnValue(mockTenantWithoutPassword);
    jest.spyOn(mockHashingService, 'hash').mockReturnValue(hashResult);

    const result = await service.signUp(signUpDto);

    expect(mockHashingService.hash).toHaveBeenCalled();
    expect(mockHashingService.hash).toHaveBeenCalledWith(signUpDto.password);

    expect(mockTenantRepository.create).toHaveBeenCalled()
    expect(mockTenantRepository.create).toHaveBeenCalledWith({ ...signUpDto, password: hashResult });

    expect(result).toEqual(mockTenantWithoutPassword);
  });

  describe('Sign in', () => {
    const signInDto = {
      email: 'jane@gmail.com',
      password: 'hello world',
    }
    it('should throw an error if password does not match', async () => {
      const returnTenant = { ...mockTenantWithoutPassword, password: "hey there" };
      jest.spyOn(mockTenantRepository, 'findByEmail').mockReturnValue(returnTenant);
      jest.spyOn(mockHashingService, 'compare').mockReturnValue(false);

      try {
        await service.signIn(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }

      expect(mockHashingService.compare).toHaveBeenCalled();
      expect(mockHashingService.compare).toHaveBeenCalledWith(signInDto.password, returnTenant.password);

      expect(mockJwtService.signAsync).not.toHaveBeenCalled();

      expect(mockTenantRepository.findByEmail).toHaveBeenCalled();
      expect(mockTenantRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);

    });

    it('should generate tokens if user exists', async () => {
      jest.spyOn(mockTenantRepository, 'findByEmail').mockReturnValue(mockTenant);
      jest.spyOn(mockHashingService, 'compare').mockReturnValue(true);
      jest.spyOn(mockJwtService, 'signAsync').mockReturnValue("hello_world");

      const result = await service.signIn(signInDto);

      expect(mockHashingService.compare).toHaveBeenCalled();
      expect(mockHashingService.compare).toHaveBeenCalledWith(signInDto.password, mockTenant.password);

      expect(mockJwtService.signAsync).toHaveBeenCalled();

      expect(mockTenantRepository.findByEmail).toHaveBeenCalled();
      expect(mockTenantRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);

      expect(result).toEqual(tokens);
    });
  });

  it('should generate token for google sign in tenants', async () => {
    jest.spyOn(mockJwtService, 'signAsync').mockReturnValue("hello_world");
    jest.spyOn(mockRefreshTokenRepository, 'update');

    const result = await service.handleGoogleRedirect(mockTenantWithoutPassword);

    expect(mockJwtService.signAsync).toHaveBeenCalled();

    expect(result).toEqual(tokens);
  });

  it('should logout a tenant', async () => {
    const message = { message: 'Logout Successfully' }
    jest.spyOn(mockRefreshTokenRepository, 'delete');

    const result = await service.logout("hello world");

    expect(mockRefreshTokenRepository.delete).toHaveBeenCalled();
    expect(result).toEqual(message);
  });

  it('should refresh token', async () => {
    const user = {
      accessToken: "hello_world"
    }

    const jwtReturnVal = { sub: 1 };
    const refreshReturnVal = {
      access_token: "hello_world",
      refresh_token: "hello_world",
      tenant: {
        id: "1",
        email: "jane@gmail.com"
      }
    };

    jest.spyOn(mockJwtService, 'verifyAsync').mockReturnValue(jwtReturnVal);
    jest.spyOn(mockRefreshTokenRepository, 'findByRefreshToken').mockReturnValue(refreshReturnVal);

    const result = await service.refreshToken("hello_world", user);

    expect(result).toEqual(tokens);
  });
});
