import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY,
  process.env.AZURE_SPEECH_REGION
)

speechConfig.speechSynthesisVoiceName = 'en-US-Bree:DragonHDLatestNeural'
speechConfig.speechSynthesisOutputFormat =
  sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3

export default speechConfig
