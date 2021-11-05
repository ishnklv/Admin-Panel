import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'
import { PORT } from "../main";

@Injectable()
export class EmailService {
  async sendActivation(to, link) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: 'aktanishenkulov@gmail.com',
        pass: 'msconfig123456789'
      }
    })
    await transporter.sendMail({
      from: 'aktanishenkulov@gmail.com',
      to,
      subject: `Activation on http://localhost:${PORT}`,
      text: '',
      html: `
        <div>
            <h1>To activate, follow the link below</h1>
            <a href="http://localhost:${PORT}/account/activate/${link}">http://localhost:${PORT}/account/activate/${link}</a>
        </div>
      `
    })
  }
  async resetPassword(to, link) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: 'aktanishenkulov@gmail.com',
        pass: 'msconfig123456789'
      }
    })
    await transporter.sendMail({
      from: 'aktanishenkulov@gmail.com',
      to,
      subject: `Reset Password on http://localhost:${PORT}`,
      text: '',
      html: `
        <div>
            <h1>To reset password, follow the link below</h1>
            <a href="${link}">${link}</a>
        </div>
      `
    })
  }
}