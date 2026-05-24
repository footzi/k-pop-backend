import { InternalServerErrorException } from '@nestjs/common';

export class SentOtpException extends InternalServerErrorException {
  constructor() {
    super({
      message: 'Failed to send confirmation email. Please try again later.',
    });
  }
}
