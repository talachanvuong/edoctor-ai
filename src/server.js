import http from 'http'
import { WebSocketServer } from 'ws'

const server = http.createServer()

const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('Hello World!')
})

server.listen(process.env.PORT)
