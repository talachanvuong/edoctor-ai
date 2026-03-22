import http from 'http'
import { WebSocketServer } from 'ws'
import deepgramService from './services/deepgramService.js'
import groqService from './services/groqService.js'
import elevenlabsService from './services/elevenlabsService.js'

const server = http.createServer()

const wss = new WebSocketServer({ server })

wss.on('connection', async (ws) => {
  // Keep alive
  ws.isAlive = true

  ws.on('pong', () => {
    ws.isAlive = true
  })

  // Create pipeline
  const elevenlabs = elevenlabsService.createInstance(ws)
  const groq = groqService.createInstance(ws, elevenlabs)
  const deepgram = await deepgramService.createConnection(ws, groq)

  // Handle events
  ws.on('message', (data, isBinary) => {
    if (!isBinary) {
      ws.close(1003)

      return
    }

    deepgram.sendMedia(data)
  })

  ws.on('close', () => {
    deepgram.sendCloseStream({ type: 'CloseStream' })
  })
})

setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate()
    }

    ws.isAlive = false

    ws.ping()
  })
}, 30000)

server.listen(process.env.PORT)
