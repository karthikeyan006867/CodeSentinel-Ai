import type { IncomingMessage, ServerResponse } from 'http';
import app, { runServerless } from '../src/server/app';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const matchedPath = (req.headers['x-matched-path'] || req.headers['x-invoke-path']) as string | undefined;
  const target = matchedPath && matchedPath !== '/api' && matchedPath !== '/api/index' && matchedPath !== '/' ? matchedPath : undefined;
  return runServerless(req, res, target);
}

export { app };

