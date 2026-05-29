import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from 'crypto';

@Injectable()
export class OtpService {
  private readonly expiresInMs = 10 * 60 * 1000;
  private readonly base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  private readonly otpStore = new Map<
    string,
    { email: string; code: string; expiresAt: number; attempts: number }
  >();

  private get transporter() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      return null;
    }

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async criarDesafio(email: string): Promise<{ challengeId: string; expiresAt: number }> {
    const challengeId = randomUUID();
    const code = randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + this.expiresInMs;

    this.otpStore.set(challengeId, { email, code, expiresAt, attempts: 0 });
    await this.enviarCodigo(email, code);

    return { challengeId, expiresAt };
  }

  validarDesafio(challengeId: string, code: string): { email: string } | null {
    const entry = this.otpStore.get(challengeId);
    const normalizedCode = code?.trim();

    if (!entry || !normalizedCode) return null;

    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(challengeId);
      return null;
    }

    entry.attempts += 1;

    if (entry.attempts > 5) {
      this.otpStore.delete(challengeId);
      return null;
    }

    if (entry.code !== normalizedCode) return null;

    this.otpStore.delete(challengeId);
    return { email: entry.email };
  }

  async enviarOtp(email: string): Promise<{ challengeId: string; expiresAt: number }> {
    return this.criarDesafio(email);
  }

  validarOtp(challengeId: string, code: string): boolean {
    return Boolean(this.validarDesafio(challengeId, code));
  }

  criarTotpSecret(): string {
    return this.toBase32(randomBytes(20));
  }

  criarTotpUri(email: string, secret: string): string {
    const issuer = 'Codigo em Video';
    const label = `${issuer}:${email}`;

    return `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30`;
  }

  validarTotp(secret: string, code: string): boolean {
    const normalizedCode = code?.replace(/\D/g, '');
    if (!secret || normalizedCode?.length !== 6) return false;

    const currentStep = Math.floor(Date.now() / 1000 / 30);

    for (let drift = -1; drift <= 1; drift += 1) {
      const expectedCode = this.gerarTotp(secret, currentStep + drift);
      const expected = Buffer.from(expectedCode);
      const received = Buffer.from(normalizedCode);

      if (expected.length === received.length && timingSafeEqual(expected, received)) {
        return true;
      }
    }

    return false;
  }

  private gerarTotp(secret: string, step: number): string {
    const key = this.fromBase32(secret);
    const counter = Buffer.alloc(8);
    counter.writeBigUInt64BE(BigInt(step));

    const hmac = createHmac('sha1', key).update(counter).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    return (binary % 1000000).toString().padStart(6, '0');
  }

  private toBase32(buffer: Buffer): string {
    const bitString = [...buffer].map((byte) => byte.toString(2).padStart(8, '0')).join('');
    let output = '';

    for (let index = 0; index < bitString.length; index += 5) {
      const chunk = bitString.slice(index, index + 5).padEnd(5, '0');
      output += this.base32Alphabet[parseInt(chunk, 2)];
    }

    return output;
  }

  private fromBase32(secret: string): Buffer {
    const cleanSecret = secret.toUpperCase().replace(/=+$/g, '').replace(/\s/g, '');
    const bytes: number[] = [];
    let bits = 0;
    let value = 0;

    for (const char of cleanSecret) {
      const index = this.base32Alphabet.indexOf(char);
      if (index === -1) continue;

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        bytes.push((value >> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(bytes);
  }

  private async enviarCodigo(email: string, code: string): Promise<void> {
    const transporter = this.transporter;

    if (!transporter) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[2FA DEV] Codigo para ${email}: ${code}`);
        return;
      }

      throw new ServiceUnavailableException('Servico de e-mail nao configurado');
    }

    try {
      await transporter.sendMail({
        from: `"Codigo em Video" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Seu codigo de acesso',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Seu codigo de acesso</h2>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${code}</p>
            <p>Expira em 10 minutos.</p>
          </div>
        `,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[2FA DEV] Falha ao enviar e-mail. Use o codigo abaixo para testar localmente.');
        console.warn(`[2FA DEV] Codigo para ${email}: ${code}`);
        return;
      }

      throw error;
    }
  }
}
