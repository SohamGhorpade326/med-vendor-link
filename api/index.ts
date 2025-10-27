// api/index.ts  (Vercel Serverless Function)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { app, connectDB } from '../server/src/app';

const handler = serverless(app);

export default async (req: VercelRequest, res: VercelResponse) => {
  await connectDB();       // ensure Mongo is connected per invocation (cached)
  return handler(req as any, res as any);
};

export const config = {
  api: {
    bodyParser: false,     // let Express handle JSON
  }
};
