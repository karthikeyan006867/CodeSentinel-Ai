import type { IncomingMessage, ServerResponse } from 'http';
import app from '../src/server/app';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const matchedPath = (req.headers['x-matched-path'] || req.headers['x-invoke-path']) as string | undefined;
  if (matchedPath && (req.url === '/api' || req.url === '/api/' || req.url === '/api/index' || req.url === '/' || !req.url)) {
    req.url = matchedPath;
  }
  return app(req, res);
}

export { app };
