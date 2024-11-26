import { SpeechConfig, AudioConfig, SpeechSynthesizer, ResultReason, PushAudioOutputStreamCallback } from "microsoft-cognitiveservices-speech-sdk";
import * as admin from "firebase-admin";

admin.initializeApp();

const storage = admin.storage();
const bucket = storage.bucket();

enum Voices {
  MALE = "uk-UA-OstapNeural",
  FEMALE = "uk-UA-PolinaNeural",
}

const SPEECH_KEY = "CxJW7A8yrZBmXsgy19SRtC81GQTc7m15MxD0iuJQKGzX4JOORiUjJQQJ99AJACYeBjFXJ3w3AAAYACOGfoSn";
const SPEECH_REGION = "eastus";

class PushAudioOutputStream extends PushAudioOutputStreamCallback {
  private buffers: Buffer[];

  constructor() {
    super();
    this.buffers = [];
  }

  write(dataBuffer: ArrayBuffer): void {
    const buffer = Buffer.from(dataBuffer);
    this.buffers.push(buffer);
  }

  close(): void {
    console.log("Audio output stream closed.");
  }

  getAudioBuffer(): Buffer {
    return Buffer.concat(this.buffers);
  }
}

export class Speech {
  static async toAudio(text: string, path: string) {
    const speechConfig = SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechSynthesisVoiceName = Voices.MALE;
    const stream = new PushAudioOutputStream();
    var synthesizer: SpeechSynthesizer | null = new SpeechSynthesizer(speechConfig, AudioConfig.fromStreamOutput(stream));

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      synthesizer?.speakTextAsync(
        text,
        function (result) {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            console.log("Озвучування завершено");
            resolve(stream.getAudioBuffer());
          } else {
            console.error("Озвучування скасовано", result.errorDetails);
            reject(Error(result.errorDetails));
          }
          synthesizer?.close();
          synthesizer = null;
        },
        function (error) {
          console.error("Озвучування скасовано", error);
          reject(error);
          synthesizer?.close();
          synthesizer = null;
        }
      );
    });

    return await new Promise((resolve, reject) => {
      const file = bucket.file(path);
      const file_stream = file.createWriteStream({ metadata: { contentType: "audio/wav" } });
      file_stream.on("error", (error) => {
        console.error("Помилка завантаження файлу у сховище", error);
        reject(error);
      });
      file_stream.on("finish", async () => {
        try {
          console.log("Файл успішно завантажено у сховище");
          const [url] = await file.getSignedUrl({ action: "read", expires: "03-01-2500" });
          resolve(url);
        } catch (error) {
          reject(error);
        }
      });
      file_stream.end(buffer);
    });
  }

  static async delete(path: string) {
    await bucket.file(path).delete({ ignoreNotFound: true });
  }
}
