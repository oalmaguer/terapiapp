import { Component } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss'],
})
export class AssistantComponent {
  constructor(private supabaseService: SupabaseService) {}

  form: FormGroup = new FormGroup({});
  q1: string = 'Ayudame a recordar cuantos huesos tiene el cuerpo humano';
  q2: string = '¿Qué hormonas aumentan la tasa metabólica basal (TMB)?';
  q3: string =
    ' ¿Qué fuente de energía utilizamos para la contracción muscular?';
  q4: string = '¿Qué es la Fisioterapia Musculoesquelética?';
  assistantResponse = [];
  userQuestions = [];
  loading = false;
  ngOnInit() {
    this.form = new FormGroup({
      question: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  setQuestion(question: string) {
    if (question) {
      this.form.get('question').setValue(question);
    }
  }
  onSubmit() {
    this.loading = true;
    if (!this.form.valid) {
      this.loading = false;

      return;
    }
    this.supabaseService
      .sendQuestion(this.form.value.question)
      .subscribe((data: any) => {
        if (data) {
          this.assistantResponse.push({ question: this.form.value.question });
          this.assistantResponse.push(JSON.parse(data).response);
          this.loading = false;
          this.form.get('question').setValue(null);
        }
      });
  }
}
