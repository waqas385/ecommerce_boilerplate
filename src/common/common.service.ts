import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decrypt, encrypt } from './util/encryption.util';

@Injectable()
export class CommonService {
  constructor(private jwtService: JwtService) {}

  public encrypt(text: string): string {
    return encrypt(text);
  }

  public decrypt(text: string): string {
    return decrypt(text);
  }

  public async generateJWT(payload: any): Promise<any> {
    return await this.jwtService.signAsync(payload);
  }

  public async verifyJWT(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  public isTimeGreaterThanOneHour(timeToCompare: string): boolean {
    const now = new Date();
    const compareTo = new Date(timeToCompare);

    const timeDifference = now.getTime() - compareTo.getTime();
    const diffInHourse = timeDifference / (1000 * 60 * 60);

    return diffInHourse > parseInt(process.env.OTP_EXPIRES_IN || '164h');
  }

  public verifyOTP(dbOTP: string, givenOtp: string): boolean {
    const [otp, timeToCompare] = dbOTP.split('_');
    return otp === givenOtp && !this.isTimeGreaterThanOneHour(timeToCompare);
  }

  public generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  public compareText(simpleText, encryptedText): boolean {
    const decryptPassword = decrypt(encryptedText);
    return simpleText === decryptPassword;
  }
}
