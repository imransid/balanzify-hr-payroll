import { MailerService } from '@nestjs-modules/mailer';

export const sendMail = (
  toEmail: string,
  subject: string,
  body: string,
  mailService: MailerService,
  attachments?: any,
) => {
  const message = `${body}`;
  mailService.sendMail({
    to: toEmail,
    subject: `${subject}`,
    text: message,
    attachments: attachments ? attachments : [],
  });
};
