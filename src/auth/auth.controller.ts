import {Body, Controller, Post, Headers} from '@nestjs/common';
import { AuthService } from './auth.service';
import {MaxLengthPipe, MinLengthPipe} from "./pipe/password.pipe";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('register/email')
  postRegisterEmail(
      @Body('nickname') nickname,
      @Body('email') email,
      @Body('password', new MaxLengthPipe(8), new MinLengthPipe(3)) password: string
  ) {
    return this.authService.registerWithEmail({
      // Pipe 에서 에러가 발생하므로 유저 생성되지 않음.
      nickname,
      email,
      password
    })
  }

  // access token 재발급
  // refresh token -> accessToken
  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true)

    const newToken = this.authService.rotateToken(token, false)

    return {
      accessToken: newToken
    }
  }

  // refresh token 재발급
  // refresh token -> refresh token
  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true)

    const newToken = this.authService.rotateToken(token, true)

    return {
      refreshToken: newToken
    }
  }

  // 로그인
  @Post('login/email')
  postLoginEmail(
     @Headers('authorization') rawToken: string
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, false)

    const credential = this.authService.decodedBasicToken(token)
    return this.authService.loginWithEmail(credential)
  }
}