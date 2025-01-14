import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; isAdmin: boolean }) {
    const { sub } = payload;
    const user = await this.userRepository.findOne({ 
      where: { id: sub },
      select: ['id', 'email', 'isAdmin'] 
    });

    if (!user) {
      throw new UnauthorizedException('Please log in to continue');
    }

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
