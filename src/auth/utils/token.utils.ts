import { UnauthorizedException } from '@nestjs/common';

export function checkTokenExpiry(iat: number, maxAgeInSeconds = 300): void {
  const currentTime = Math.floor(Date.now() / 1000);
  if (!iat) {
    throw new UnauthorizedException('Invalid token: No issue time (iat) found');
  }
  if (currentTime - iat > maxAgeInSeconds) {
    throw new UnauthorizedException('Token has expired (older than 5 minutes)');
  }
}

export function extractTokenFromHeader(
  headers: Record<string, string | string[] | undefined>,
): string | undefined {
  const [type, token] = headers.authorization?.toString().split(' ') ?? [];
  // console.log(`Extracted Token Type: ${type}, Token: ${token}`);
  return type === 'Bearer' ? token : undefined;
}
