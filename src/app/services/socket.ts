import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: WebSocket | null = null;
  private aiReportSubject = new Subject<any>();
  aiReport$ = this.aiReportSubject.asObservable();

  connectToAI(): void {
    // الرابط الخاص بسيرفر الـ AI
    const url = 'wss://jerold-unmimetic-jess.ngrok-free.dev/ws/head-pose';
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'result') {
        this.aiReportSubject.next(message);
      }
    };

    this.socket.onopen = () => console.log('✅ AI Socket Connected');
    this.socket.onclose = () => console.warn('⚠️ AI Socket Closed');
    this.socket.onerror = (err) => console.error('❌ Socket Error:', err);
  }

  sendFrame(base64Data: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'frame', data: base64Data }));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.send(JSON.stringify({ type: 'stop' }));
      setTimeout(() => { this.socket?.close(); this.socket = null; }, 500);
    }
  }
}
