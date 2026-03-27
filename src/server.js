import http from 'http'
import { WebSocketServer } from 'ws'
import deepgramService from './services/deepgramService.js'
import groqService from './services/groqService.js'
import speechService from './services/speechService.js'

process.on('uncaughtException', () => {})
process.on('unhandledRejection', () => {})

const server = http.createServer((_req, res) => {
  res.writeHead(200)
  res.end('OK')
})

const wss = new WebSocketServer({ server })

wss.on('connection', async (ws) => {
  ws.isAlive = true

  ws.on('pong', () => {
    ws.isAlive = true
  })
  ws.on('error', () => {})

  let deepgram

  try {
    const speech = speechService.createInstance(ws)
    const groq = groqService.createInstance(ws, speech)
    deepgram = await deepgramService.createConnection(ws, groq)
  } catch {
    if (ws.readyState === 1) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Không thể khởi tạo, vui lòng kết nối lại.',
        })
      )
    }
    ws.close(1011)
    return
  }

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
