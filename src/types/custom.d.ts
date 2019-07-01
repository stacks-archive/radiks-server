declare module '@awaitjs/express' {
  import express from 'express';

  type AsyncHandler = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<any>;

  interface AsyncRouter extends express.Router {
    getAsync(path: string, handler: AsyncHandler): void;
    postAsync(path: string, handler: AsyncHandler): void;
    deleteAsync(path: string, handler: AsyncHandler): void;
  }

  export function addAsync(router: express.Router): AsyncRouter;
}

declare module 'query-to-mongo';
