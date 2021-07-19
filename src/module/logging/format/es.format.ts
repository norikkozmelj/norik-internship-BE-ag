import { Request } from 'express';
import { hostname } from 'os';
import { Logform } from 'winston';
import { getClientIp } from 'request-ip';

const HOSTNAME = hostname();

interface EsInfo extends Logform.TransformableInfo {
  '@timestamp': string;
  message: string;
  pid: number;
  host: string;
  tags?: string[];
  err?: {
    name: string;
    message: string;
    stack: string;
  };
  level: string;
  name?: string;
  request?: {
    method: string;
    url: string;
    normalizedUrl?: string;
    remoteAddress: string | null;
    user?: number;
    body?: string;
  };
  response?: {
    statusCode: number;
    responseTime: number;
  };
}

export class EsFormat {
  transform(info: Logform.TransformableInfo): EsInfo {
    const result: EsInfo = {
      '@timestamp': info['@timestamp'] || new Date().toISOString(),
      host: HOSTNAME,
      message: info.message || '',
      pid: process.pid,
      tags: info.tags,
      level: info.level,
      name: info.name,
    };

    const { request, response, err } = info;
    if (request) {
      result.request = {
        method: request.method || '',
        url: request.originalUrl || request.url,
        normalizedUrl: normalizeExpressPath(request),
        remoteAddress: getClientIp(request),
        user: request.user ? request.user.id : undefined,
        body: request.body
          ? JSON.stringify(request.body, removeFields)
          : undefined,
      };
    }
    if (response) {
      result.response = {
        statusCode: response.statusCode,
        responseTime: response.responseTime,
      };
    }

    if (err) {
      result.err = {
        name: err.name ? err.name : undefined,
        message: err.message ? err.message : undefined,
        stack: err.stack ? err.stack : undefined,
      };
    }

    return result;
  }
}

export default function(): EsFormat {
  return new EsFormat();
}

function normalizeExpressPath(req: Request): string | undefined {
  const expressReq = req;
  if ('route' in expressReq && expressReq.route.path !== undefined) {
    return (expressReq.baseUrl || '') + expressReq.route.path.toString();
  }
}

function removeFields(name: string, val: string) {
  if (name === 'password' || name === 'access_token') {
    return '***';
  } else {
    return val;
  }
}
