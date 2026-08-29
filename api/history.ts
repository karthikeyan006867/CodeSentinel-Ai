import type { IncomingMessage, ServerResponse } from 'http';
import { runServerless } from '../src/server/app';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return runServerless(req, res, '/api/history');
}

