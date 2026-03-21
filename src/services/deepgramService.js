import deepgramConfig from '../config/deepgramConfig.js'

const createConnection = async (client, groq) => {
  const deepgram = await deepgramConfig.listen.v1.connect({
    model: 'nova-3',
    language: 'vi',
    smart_format: true,
    interim_results: true,
    endpointing: 300,
    utterance_end_ms: 1200,
  })

  let keepAlive

  deepgram.on('open', () => {
    keepAlive = setInterval(() => {
      deepgram.sendKeepAlive({ type: 'KeepAlive' })
    }, 3000)
  })

  const fullSentences = []

  deepgram.on('message', async (msg) => {
    if (msg.type === 'UtteranceEnd' && fullSentences.length !== 0) {
      client.send(
        JSON.stringify({
          type: 'result',
          data: fullSentences.join(' '),
        })
      )

      await groq.send(fullSentences.join(' '))

      fullSentences.length = 0

      return
    }

    if (msg.type !== 'Results') {
      return
    }

    const sentence = msg.channel.alternatives[0].transcript

    if (sentence.length === 0) {
      return
    }

    if (msg.is_final === true) {
      fullSentences.push(sentence)
    }

    if (msg.speech_final === true) {
      client.send(
        JSON.stringify({
          type: 'result',
          data: fullSentences.join(' '),
        })
      )

      await groq.send(fullSentences.join(' '))

      fullSentences.length = 0
    }
  })

  deepgram.on('close', () => {
    clearInterval(keepAlive)
  })

  deepgram.on('error', (err) => {
    client.send(
      JSON.stringify({
        type: 'error',
        message: err,
      })
    )
  })

  deepgram.connect()

  await deepgram.waitForOpen()

  return deepgram
}

export default {
  createConnection,
}
