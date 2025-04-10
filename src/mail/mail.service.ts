import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailDto } from './dto/mail.dto';
import { activationTemplate } from './templates/activation';
import { resetPasswordTemplate } from './templates/resetPassword';

@Injectable()
export class MailService {

  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: Number(process.env.MAILER_PORT),
      secure: process.env.MAILER_SECURE === 'true',
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });
  }

  async sendActivationEmail(mailDto: MailDto) {
    const subject = 'Ativação de Conta - Só Terrenos'
    const activationUrl = `${process.env.FRONTEND_URL}/activate/${mailDto.token}`;

    await this.transporter.sendMail({
      from: `"No Reply" <${process.env.MAILER_FROM}>`,
      to: mailDto.email,
      subject,
      text: activationTemplate(subject, mailDto.name, activationUrl)
    });
  }

  async sendResetPasswordEmail(mailDto: MailDto) {
    const subject = 'Reset sua senha - Só Terrenos'
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${mailDto.token}`;

    await this.transporter.sendMail({
      from: `"No Reply" <${process.env.MAILER_FROM}>`,
      to: mailDto.email,
      subject,
      text: resetPasswordTemplate(subject, mailDto.name, resetUrl)
    });
  }
}