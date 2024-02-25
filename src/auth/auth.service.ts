import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersModel} from "../users/entities/users.entity";
import {HASH_ROUNDS, JWT_SECRET} from "./const/auth.const";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    /*
    토큰 검증
    header 토큰이 Basic or Bearer
    {authorization: 'Basic {token}'}
    {authorization: 'Bearer {token}'}
     */

    extractTokenFromHeader(header: string, isBearer: boolean) {
        const splitToken = header.split(' ')
        const prefix = isBearer ? 'Bearer' : 'Basic'

        if (splitToken.length !== 2 || splitToken[0] !== prefix) throw new UnauthorizedException('잘못된 토근입니다.')

        return splitToken[1]
    }

    decodedBasicToken(base64string: string) {
        const decoded = Buffer.from(base64string, 'base64').toString('utf-8')
        const split = decoded.split(':')

        if(split.length !== 2) throw new UnauthorizedException('잘못된 유형의 토큰입니다.')

        return {
            email: split[0],
            password: split[1]
        }
    }

    // 토큰 검증
    verifyToken(token: string) {
        return this.jwtService.verify(token, {
            secret: JWT_SECRET
        })
    }

    // 토큰 재발급: refresh token -> access token
    rotateToken(token: string, isRefreshToken: boolean) {
        const decoded = this.jwtService.verify(token, {
            secret: JWT_SECRET
        })
        // sub: id
        // email: email
        // type: 'access' | 'refresh'
        if(decoded.type !== 'refresh') {
            throw new UnauthorizedException('토근 재발급은 Refresh 토큰으로만 가능합니다!')
        }

        return this.signToken({
            ...decoded
        }, isRefreshToken)
    }

    // 토큰 생성
    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
        const payload = {
            email: user.email,
            id: user.id,
            type: isRefreshToken ? 'refresh' : 'access'
        }

        return this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            expiresIn: isRefreshToken ? 3600 : 500
        })
    }

    async loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true)
        }
    }

    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
        // 사용자 있는지 확인
        const existingUser = await this.usersService.getUserByEmail(user.email)

        if(!existingUser) throw new UnauthorizedException('존재하지 않는 사용자입니다.')

        // 비밀번호 검증
        const passOk = bcrypt.compare(user.password, existingUser.password)
        if(!passOk) throw new UnauthorizedException('비밀번호가 틀렸습니다.')

        return existingUser
    }

    async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
        const existingUser = await this.authenticateWithEmailAndPassword(user)

        return this.loginUser(existingUser)
    }

    async registerWithEmail(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
        const hash = await bcrypt.hash(
            user.password,
            HASH_ROUNDS,
        )

        const newUser = await this.usersService.createUser({
            ...user,
            password: hash
        })
        return this.loginUser(newUser)
    }
}
