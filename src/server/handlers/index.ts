import { XtPacket } from '..'
import { Client } from '../penguin'

type XTCallback = (client: Client, ...args: string[]) => void

export class XtHandler {
  listeners: Map<string, XTCallback[]>

  constructor () {
    this.listeners = new Map<string, XTCallback[]>()
  }
  xt (extension: string, code: string, method: XTCallback): void
  xt (code: string, method: XTCallback): void

  /* Add listener for XT packet */
  xt (...args: any): void {
    let extension: string = 's'
    let code: string
    let method: XTCallback
    if (args.length === 3) {
      extension = args[0]
      code = args[1]
      method = args[2]
    } else {
      code = args[0]
      method = args[1]
    }
    const packetName = this.getPacketName(code, extension)
    const callbacks = this.listeners.get(packetName)
    if (callbacks === undefined) {
      this.listeners.set(packetName, [method])
    } else {
      this.listeners.set(packetName, [...callbacks, method])
    }
  }

  private getPacketName (code: string, extension: string): string {
    return `${extension}%${code}`
  }

  getCallback (packet: XtPacket): (XTCallback[] | undefined) {
    return this.listeners.get(this.getPacketName(packet.code, packet.handler))
  }

  use (handler: XtHandler): void {
    handler.listeners.forEach((callbacks, name) => {
      const existingCallbacks = this.listeners.get(name)
      if (existingCallbacks === undefined) {
        this.listeners.set(name, callbacks)
      } else {
        this.listeners.set(name, [...existingCallbacks, ...callbacks])
      }
    })
  }
}
