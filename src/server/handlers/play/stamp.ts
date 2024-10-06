import { XtHandler } from "..";

const handler = new XtHandler()

// getting pin information opening stampbook
handler.xt('i#qpp', (client, id) => {
  client.sendXt('qpp', client.getPinString())
})

// stampbook cover information
handler.xt('st#gsbcd', (client, id) => {
  client.sendXt('gsbcd', client.getStampbookCoverString())
})

// getting all the player stamps
handler.xt('st#gps', (client, id) => {
  client.sendStamps()
})

// getting recent player stamps
handler.xt('st#gmres', (client) => {
  // TODO implement feature
  client.sendXt('gmres', '')
})

export default handler