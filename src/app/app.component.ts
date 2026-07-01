import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentService, AssessmentResponse } from './services/assessment.service';
import { AudioRecordingService } from './services/audio-recording.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  referenceText = "The quick brown fox jumps over the lazy dog. Programming is a very fun and creative activity.";

  isRecording = false;
  isLoading = false;
  audioBlob: Blob | null = null;
  result: AssessmentResponse | null = null;

  constructor(
    private assessmentService: AssessmentService,
    private audioRecordingService: AudioRecordingService
  ) {}

  async startRecording() {
    this.audioBlob = null;
    this.result = null;

    try {
      await this.audioRecordingService.startRecording();
      this.isRecording = true;
    } catch (error) {
      alert("Por favor permite el acceso al micrófono para usar la aplicación.");
    }
  }

  async stopRecording() {
    if (this.isRecording) {
      try {
        this.audioBlob = await this.audioRecordingService.stopRecording();
        this.isRecording = false;
      } catch (error) {
        console.error("Error al detener la grabación:", error);
      }
    }
  }

  analyze() {
    if (!this.audioBlob) return;

    this.isLoading = true;
    this.assessmentService.analyzeReading(this.audioBlob, this.referenceText)
      .subscribe({
        next: (response) => {
          this.result = response;
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error en el análisis:", error);
          alert("Hubo un error al procesar el audio. Revisa la consola.");
          this.isLoading = false;
        }
      });
  }
}
