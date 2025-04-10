import { Body, Controller, Post } from '@nestjs/common';
import { MailDto } from './dto/mail.dto';
import { MailService } from './mail.service';

@Controller()
export class AppController {
  constructor(private readonly mailService: MailService) { }

  @Post()
  sendActivationEmail(@Body() body: MailDto) {
    return this.mailService.sendActivationEmail(body)
  }

  @Post()
  sendResetPasswordEmail(@Body() body: MailDto) {
    return this.mailService.sendResetPasswordEmail(body)
  }
}
