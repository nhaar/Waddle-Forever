import fs from 'fs'
import path from 'path'

interface PenguinServer {
  id: string
  name: string
  port: string
  lang: 'en' | 'pt' | 'es' | 'fr'
}

// let serversXml = `<?xml version="1.0" encoding="UTF-8"?>
// <servers>
//    <environment name="live">
//       <login address="127.0.0.1" port="6112" />
//       <redemption address="127.0.0.1" port="9875" />`

const serverList: PenguinServer[] = [
  {
    id: '3100',
    name: 'Blizzard',
    port: '9875',
    lang: 'en'
  },
  {
    id: '3101',
    name: 'Glaciar',
    port: '9876',
    lang: 'es'
  },
  {
    id: '3102',
    name: 'Avalanche',
    port: '9877',
    lang: 'pt'
  },
  {
    id: '3103',
    name: 'Yeti',
    port: '9878',
    lang: 'fr'
  }
]

const serversXml = `
<?xml version="1.0" encoding="UTF-8"?>
<servers>
   <environment name="live">
      <login address="127.0.0.1" port="6112" />
      <redemption address="127.0.0.1" port="9875" />
      ${serverList.map((server) => {
        return `
          <language locale="${server.lang}">
            <server id="${server.id}" name="${server.name}" safe="false" address="127.0.0.1" port="${server.port}" />
          </language>
        `
      }).join('')}
    </environment>
</servers>
`
// serverList.forEach((server) => {
//   serversXml += `
//   <language locale="${server.lang}">
//     <server id="${server.id}" name="${server.name}" safe="false" address="127.0.0.1" port="${server.port}" />
//   </language>
//   `
// })

// serversXml += `
//    </environment>
// </servers>`

fs.writeFileSync(path.join(process.cwd(), 'media/servers.xml'), serversXml)

export default serverList
