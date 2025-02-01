import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {InputText} from "primeng/inputtext";
import {Card} from "primeng/card";
import {Message} from "primeng/message";
import {UserService} from "../../app/services/user.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {FloatLabel} from "primeng/floatlabel";

@Component({
  selector: 'app-login',
  imports: [
    InputText,
    Card,
    Message,
    FormsModule,
    Button,
    FloatLabel
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  errorMessage = signal<string | null>(null);
  #benutzerService = inject(UserService);
  #ref = inject(DynamicDialogRef);

  async login() {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Bitte Benutzername und Passwort eingeben!');
      return;
    }

    const result = await this.#benutzerService.logIn(this.username(), this.password());
    if (result === false) {
      this.errorMessage.set('Benutzername oder Passwort falsch!');
      return
    }

    this.#ref.close(result);

  }

}
