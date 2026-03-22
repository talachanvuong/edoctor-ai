import elevenlabsConfig from '../config/elevenlabsConfig.js'

const createInstance = (client) => {
  const send = async (text) => {
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
      client.send(chunk)
    }
  }

  return {
    send,
  }
}

export default {
  createInstance,
}
