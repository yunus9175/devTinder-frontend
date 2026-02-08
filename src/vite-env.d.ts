/// <reference types="vite/client" />

declare module 'socket.io-client' {
  export interface Socket {
    on(event: string, callback: (...args: any[]) => void): this
    off(event: string, callback?: (...args: any[]) => void): this
    emit(event: string, ...args: any[]): this
    disconnect(): this
    connected: boolean
  }

  export interface ManagerOptions {
    path?: string
    withCredentials?: boolean
    transports?: string[]
    reconnection?: boolean
    reconnectionAttempts?: number
    reconnectionDelay?: number
    timeout?: number
  }

  export function io(uri: string, opts?: ManagerOptions): Socket
}
