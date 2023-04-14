import { appEnvs } from 'config';
import type * as express from 'express';
import * as jwt from 'jsonwebtoken';

export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]) {
  if (securityName === 'bearer') {
    const bearer = request.headers.authorization;

    return await new Promise((resolve, reject) => {
      if (!bearer?.startsWith('Bearer')) {
        reject(new Error('Authorization token not provided'));
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const [, token] = bearer.split(' ');
      if (!token) {
        reject(new Error('Authorization token is invalid'));
      }

      jwt.verify(token, appEnvs.jwtSecret, function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  if (securityName === 'jwt') {
    const token = request.body.token || request.query.token || request.headers.authorization;

    return await new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
      }
      jwt.verify(token, appEnvs.jwtSecret, function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          // Check if JWT contains all required scopes
          if (scopes) {
            for (const scope of scopes) {
              if (!decoded.scopes.includes(scope)) {
                reject(new Error('JWT does not contain required scope.'));
              }
            }
          }

          resolve(decoded);
        }
      });
    });
  }
}
