import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JWT authentication guard that protects routes by validating JWT tokens in the Authorization header
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
