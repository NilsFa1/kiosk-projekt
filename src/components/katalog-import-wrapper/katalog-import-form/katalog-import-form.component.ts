import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';
import {BadgeModule} from "primeng/badge";
import {MessageService} from "primeng/api";
import {Button, ButtonModule} from "primeng/button";
import {ProgressBarModule} from "primeng/progressbar";
import {FileUpload, FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {Toast, ToastModule} from "primeng/toast";
import {CommonModule} from "@angular/common";
import {Avatar} from "primeng/avatar";
import {Card} from "primeng/card";
import {AnalyzeRequestParams, UpdateUserRequestParams} from "../../../models/Benutzer";
import {InputText} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {Tooltip} from "primeng/tooltip";
import {Router} from '@angular/router';
import {usingFetch} from "../../../app/services/$HttpClient";

@Component({
  selector: 'katalog-import-form',
  standalone: true,
  templateUrl: './katalog-import-form.component.html',
  imports: [
    CommonModule, ProgressBarModule, Button, Toast, FileUpload, ButtonModule, ToastModule, FileUploadModule, BadgeModule, Avatar, Card, InputText, FormsModule, FloatLabel, InputGroup, InputGroupAddon, Tooltip
  ],
  styleUrl: './katalog-import-form.component.css',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KatalogImportFormComponent {
  messageService = inject(MessageService);
  router = inject(Router);
  $fetch = usingFetch();

  $token = signal('')
  $url = signal('');

  public $up = viewChild<FileUpload>('fileUpload');

  async handleUpload(event: FileUploadHandlerEvent) {
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});

    const fileUrlsAsync = event.files.map(file => {
      const fileReader = new FileReader();
      return new Promise(resolve => {
        fileReader.onload = ev => {
          resolve(ev.target?.result)
        }
        fileReader.readAsDataURL(file)
      })
    });

    const fileUrls = await Promise.all(fileUrlsAsync);

    const reqPayload = {fileUrls: fileUrls, type: ''} as AnalyzeRequestParams;

    await this.$fetch('/v1/admin/analyze', {method: "POST", payload: {body: reqPayload}})

    this.messageService.add({severity: 'success', summary: 'Erfolg', detail: 'Extrahieren der Daten gestartet'});
    this.router.navigate(['/']);
  }

  choose() {
    this.$up()?.choose();
  }

  async setKIData() {
    const reqPayload = {openApiToken: this.$token(), openApiUrl: this.$url()} as UpdateUserRequestParams;
    await this.$fetch('/v1/admin/updateUser', {method: "POST", payload: {body: reqPayload}})
  }
}
