import crypto from 'crypto';
import {
  ENCRYPTION_ALGORITHM,
  ENCRYPTION_KEY,
} from '~/config/encryption.config';

export const encryptApiKey = (text: string): string => {
  if (!text) return text;
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

export const decryptApiKey = (text: string): string => {
  if (!text || !text.includes(':')) return text;
  
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = textParts.join(':');
    
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', { text, error: (error as Error).message });
    return text;
  }
};