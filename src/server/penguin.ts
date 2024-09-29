import net from 'net'

import { isGameRoom, Room } from './game/rooms'
import { get, Penguin, run } from './database'

export class Client {
  socket: net.Socket
  penguin: Penguin
  x: number
  y: number

  constructor (socket: net.Socket) {
    this.socket = socket
    this.penguin = Client.getDefault()
    /* TODO, x and y random generation at the start? */
    this.x = 100
    this.y = 100
  }

  send (message: string): void {
    this.socket.write(message + '\0')
  }

  sendXt (handler: string, ...args: Array<number | string>): void {
    console.log('xt: ', `%xt%${handler}%-1%` + args.join('%') + '%')
    this.send(`%xt%${handler}%-1%` + args.join('%') + '%')
  }

  get penguinString (): string {
    return [
      this.penguin.id,
      this.penguin.name,
      1, // meant to be approval, but always approved
      this.penguin.color,
      this.penguin.head,
      this.penguin.face,
      this.penguin.neck,
      this.penguin.body,
      this.penguin.hand,
      this.penguin.feet,
      this.penguin.flag,
      this.penguin.background,
      this.x,
      this.y,
      1, // TODO, figure what this "frame" means
      1, // TODO this is for members, in the future a non-member option?,
      this.memberAge,
      0, // TODO figure out what this "avatar" is
      0, // TODO figure out what penguin state is
      0, // TODO figure out what party state is
      0, // TODO figure out what puffle state is
      '', // TODO figure out what empty strings are for (and if are necessary)
      '',
      '',
      ''
    ].join('|')
  }

  get age (): number {
    // difference converted into days
    return Math.floor((Date.now() - this.penguin.registration_date) / 1000 / 86400)
  }

  get memberAge (): number {
    // TODO implement proper for this, if ever needed
    return this.age
  }

  joinRoom (room: Room): void {
    const string = this.penguinString
    if (isGameRoom(room)) {
      this.sendXt('jg', room)
    } else {
      this.sendXt('jr', room, string)
      this.sendXt('ap', string)
    }
  }

  async update (): Promise<void> {
    await run('UPDATE penguin SET name = ?, is_agent = ?, mascot = ?, color = ?, head = ?, face = ?, neck = ?, body = ?, hand = ?, feet = ?, flag = ?, background = ?, coins = ? WHERE id = ?', [
      this.penguin.name,
      this.penguin.is_agent,
      this.penguin.mascot,
      this.penguin.color,
      this.penguin.head,
      this.penguin.face,
      this.penguin.neck,
      this.penguin.body,
      this.penguin.hand,
      this.penguin.feet,
      this.penguin.flag,
      this.penguin.background,
      this.penguin.coins,
      this.penguin.id
    ])
  }

  private async getPenguinFromName (name: string): Promise<boolean> {
    const penguins = await get<Penguin>('SELECT * FROM penguin WHERE name = ?', [name])
    if (penguins.length === 0) {
      return false
    } else {
      this.penguin = penguins[0]
      return true
    }
  }

  async create (name: string, mascot: number = 0): Promise<void> {
    const found = await this.getPenguinFromName(name)
    if (!found) {
      await run('INSERT INTO penguin (name, is_agent, mascot, color, head, face, neck, body, hand, feet, flag, background, registration_date, coins, minutes_played) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        name, 0, mascot, 1, 0, 0, 0, 0, 0, 0, 0, 0, Date.now(), 500, 0
      ])
      await this.getPenguinFromName(name)
    }
  }

  static getDefault (): Penguin {
    return {
      id: 0,
      name: '',
      mascot: 0,
      is_agent: 0,
      color: 1,
      head: 0,
      face: 0,
      neck: 0,
      body: 0,
      hand: 0,
      feet: 0,
      flag: 0,
      background: 0,
      registration_date: 0,
      coins: 0,
      minutes_played: 0
    }
  }
}
