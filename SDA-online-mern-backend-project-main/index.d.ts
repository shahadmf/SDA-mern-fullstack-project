declare namespace Express {
  interface Request {
    msg: string
    user: {
      id: string
      firstName: string
    }
  }
}
