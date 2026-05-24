import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserService } from "../user/user.service";
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { SentOtpException } from './error/send-otp.error'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient
  ) {}

  async startAuth(email: string) {
    const hasUser = this.userService.hasUser(email);

    if (!hasUser) {
      throw new UnauthorizedException();
    }

    const { error } = await this.supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      throw new SentOtpException();
    }
  }
}
