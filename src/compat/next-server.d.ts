declare module 'next/server' {
  export class NextRequest extends Request {}
  export class NextResponse extends Response {
    static json(data: unknown, init?: ResponseInit): NextResponse
  }
}

