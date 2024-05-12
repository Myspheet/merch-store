import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './strategy/google/google.guard';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './strategy/jwt/jwt-auth.guard';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/singup.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenGuard } from './strategy/jwt/refresh-token.guard';
import { UserEntity } from 'src/user/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiBody({ type: SignUpDto })
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiBody({ type: SignInDto })
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signIn(
    @Body() signInDto: SignInDto
  ) {
    return this.authService.signIn(signInDto);
  }

  @ApiBody({ type: SignInDto })
  @HttpCode(HttpStatus.OK)
  @Post('/admin/signin')
  adminSignIn(
    @Body() signInDto: SignInDto
  ) {
    return this.authService.adminSignIn(signInDto);
  }

  // @UseGuards(GoogleGuard)
  // @Get('google/redirect')
  // handlerRedirect(@Req() req) {
  //   return this.authService.handleGoogleRedirect(req.user);
  // }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('/verify/token')
  @UseGuards(JwtAuthGuard)
  verifyToken(@GetUser() user: UserEntity, @Req() req) {
    const token = req.headers['authorization'].split(" ")[1];
    return this.authService.verifyToken(user, token);
  }

  @ApiBearerAuth()
  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @GetUser() user,) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token, user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req) {
    const token = req.headers['authorization'].split(" ")[1];
    return this.authService.logout(token);
  }
}