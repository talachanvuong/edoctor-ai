import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

export default new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})
