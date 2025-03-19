import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstant } from 'src/auth/constants/jwt.constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JwtConstant.SECRET,
      signOptions: { expiresIn: JwtConstant.EXPIRES_IN },
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
