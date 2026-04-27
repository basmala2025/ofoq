import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AudioRecordingService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'https://ofoqai.runasp.net/api';
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  /**
   * Initializes the microphone stream and starts recording audio chunks.
   */
  async startRecording() {
    this.audioChunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      console.log('🎙️ Microphone recording started...');
    } catch (error) {
      console.error('❌ Microphone Error:', error);
      throw error;
    }
  }

  /**
   * Stops the current recording, packages the audio as a Blob,
   * and uploads it to the backend via FormData.
   */
  stopRecordingAndSend(sessionData: any, lectureId: string) {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.onstop = () => {
      // Create a blob using the browser's native webm type to prevent file corruption
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const fileSizeKB = (audioBlob.size / 1024).toFixed(2);
      console.log(`📊 Final Audio File Size: ${fileSizeKB} KB`);

      if (audioBlob.size === 0) {
        alert('Recorded file is empty!');
        return;
      }

      const formData = new FormData();
      // Using 'file' as the key to match the Swagger API documentation
      formData.append('file', audioBlob, 'lecture-audio.webm');

      // Optional: Include sessionData if required by future backend iterations
      // formData.append('sessionData', JSON.stringify(sessionData));

      console.log(`📤 Sending to: ${this.baseUrl}/lectures/${lectureId}/process-audio`);

      this.http.post(`${this.baseUrl}/lectures/${lectureId}/process-audio`, formData)
        .subscribe({
          next: (res: any) => {
            console.log('🚀 AI Success! Response:', res);
            if (res.summary) {
              console.log('%c📝 Summary:', 'color: #7113c8; font-weight: bold;', res.summary);
            }
            alert('Summary received successfully! Check the Console.');
          },
          error: (err) => {
            console.error('❌ API Error:', err.error);
            alert(`Server Error: ${err.error?.message || 'Unexpected Error'}`);
          }
        });

      // Stop all tracks in the stream to release the microphone hardware
      this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
    };

    this.mediaRecorder.stop();
    console.log('🔴 Recording stopped.');
  }
}
