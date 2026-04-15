declare module 'next/og' {
  export class ImageResponse extends Response {
    constructor(content: React.ReactNode, init?: ResponseInit)
  }
}

