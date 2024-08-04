import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService, private usersService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
              ExtractJwt.fromAuthHeaderAsBearerToken(),
              (request) => {
                var data = request.session
                console.log(data.jwt)
                if (!data) {
                    return null;
                }
                return data.jwt;
              }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const userId = parseInt(payload.sub);

        console.log(payload)
        if (!userId) {
            throw new UnauthorizedException('Invalid token');
        }
        const user = await this.usersService.findOne(userId);
        if (!user) {
        throw new Error("Unauthorized");
        }
        return user;
    }
}
