declare global {
  namespace Express {
    interface Request {
      memberId?: number;
    }
  }
}

export {};
