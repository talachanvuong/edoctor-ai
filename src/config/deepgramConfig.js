import { DeepgramClient } from '@deepgram/sdk'

export default new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
})
