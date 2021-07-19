import { RequestUserPayload } from './request-user-payload.interface';

export interface RequestWithUser extends Request {
  user: RequestUserPayload;
}
