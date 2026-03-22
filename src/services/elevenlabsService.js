import elevenlabsConfig from '../config/elevenlabsConfig.js'

const createInstance = (client) => {
  const send = async (text) => {
    try {
      const stream = await elevenlabsConfig.textToSpeech.stream(
        process.env.VOICE_ID,
        {
          modelId: 'eleven_flash_v2_5',
          text,
          languageCode: 'vi',
          voiceSettings: {
            speed: 1.0,
            stability: 0.35,
            similarityBoost: 0.55,
          },
        }
      )

      for await (const chunk of stream) {
        if (client.readyState !== 1) {
          break
        }

        client.send(chunk)
      }
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
