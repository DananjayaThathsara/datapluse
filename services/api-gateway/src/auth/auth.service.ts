import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  // Inject User repository to manage users in the database and JwtService to create JWT tokens
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Registers a new user — checks if email is already registered, hashes the password, saves the user, and returns a JWT token
  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ email: dto.email, passwordHash });
    await this.userRepo.save(user);

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token: token };
  }

  // Logs in a user — checks credentials and returns a JWT token if valid
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { access_token: token };
  }
}
