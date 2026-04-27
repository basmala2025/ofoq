import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  public isRecording = false;

private apiUrl = 'https://ofoqai.runasp.net/api/lectures/{id}/process-audio';
  constructor(private http: HttpClient, private router: Router) {}

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      console.log('🎤 Audio recording started...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('الرجاء السماح بالوصول إلى المايكروفون لبدء التسجيل.');
    }
  }

 stopRecordingAndSend(sessionData: any, lectureId: number) {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const formData = new FormData();

        formData.append('audioFile', audioBlob, 'lecture_audio.webm');

        const apiUrl = `https://ofoqai.runasp.net/api/lectures/${lectureId}/process-audio`;

        console.log(`📤 Sending audio to: ${apiUrl}`);

        this.http.post(apiUrl, formData).subscribe({
          next: (response: any) => {
            console.log('%c✅ AI Summary Received Successfully!', 'color: #10b981; font-weight: bold;');
            console.dir(response);

            const aiSummaryText = response.summary || response.text || "تم التلخيص بنجاح!";
            alert(`✨ تم معالجة المحاضرة بنجاح!\n\n📋 الملخص الذكي:\n${aiSummaryText}`);
          },
          error: (error) => {
            console.error('%c❌ API Error!', 'color: white; background: #ef4444; padding: 5px;');
            console.error(error);
            alert('حدث خطأ أثناء الاتصال بسيرفر الذكاء الاصطناعي.');
          }
        });

        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.stop();
      this.isRecording = false;
      console.log('🛑 Audio recording stopped.');
    }
  }
}
