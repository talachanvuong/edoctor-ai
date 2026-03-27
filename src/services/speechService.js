import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import speechConfig from '../config/speechConfig.js'

const createInstance = (client) => {
  const send = async (text) => {
    try {
      await new Promise((resolve, reject) => {
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig)

        synthesizer.synthesizing = (s, e) => {
          if (client.readyState !== 1) {
            synthesizer.close()
            return
          }
          client.send(e.result.audioData)
        }

        synthesizer.speakTextAsync(
          text,
          () => {
            synthesizer.close()
            resolve()
          },
          (err) => {
            synthesizer.close()
            reject(err)
          }
        )
      })
    } catch {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: 'error',
            message: 'TTS lỗi, không thể phát âm thanh.',
          })
        )
      }
    }
  }

  return {
    send,
  }
}

export default {
  createInstance,
}
