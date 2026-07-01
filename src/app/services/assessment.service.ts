import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Nuestro contrato exacto con el backend
export interface AnalyzedWord {
  word: string;
  status: 'CORRECT' | 'OMITTED' | 'MISREAD';
}

export interface AssessmentResponse {
  accuracyScore: number;
  analyzedWords: AnalyzedWord[];
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  // La URL de nuestro backend en Spring Boot
  private apiUrl = 'http://localhost:8080/api/assessment/analyze';

  constructor(private http: HttpClient) { }

  analyzeReading(audioBlob: Blob, referenceText: string): Observable<AssessmentResponse> {
    // Usamos FormData para enviar el archivo de audio y el texto de forma nativa
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('referenceText', referenceText);

    return this.http.post<AssessmentResponse>(this.apiUrl, formData);
  }
}
