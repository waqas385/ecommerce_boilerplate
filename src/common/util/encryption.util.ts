import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import { JwtConstant } from 'src/auth/constants/jwt.constants';

export function encrypt(text: string): string {
  try {
    const { algo, key, iv } = getEncryptDecryptOptions();

    const cipher = createCipheriv(algo, key, iv);
    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);
    return encryptedText.toString('hex');
  } catch (error) {
    throw new Error(error);
  }
}

export function decrypt(text: string): string {
  try {
    const { algo, key, iv } = getEncryptDecryptOptions();
    const encryptedText = Buffer.from(text, 'hex');
    const decipher = createDecipheriv(algo, key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.log('ERROR OCCURRED WHILE DECRYPTING:', err);
    return ''
  }
}

function getEncryptDecryptOptions(): any {
  return {
    algo: JwtConstant.ENCRYPT_DECRYPT_ALGO,
    iv: JwtConstant.ENCRYPT_DECRYPT_IV,
    key: scryptSync(JwtConstant.ENCRYPT_DECRYPT_KEY, 'salt', 32),
  };
}
