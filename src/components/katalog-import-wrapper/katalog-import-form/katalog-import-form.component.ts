import {Component, inject, signal, viewChild} from '@angular/core';
import {Badge, BadgeModule} from "primeng/badge";
import {MessageService} from "primeng/api";
import {Button, ButtonModule} from "primeng/button";
import {ProgressBar, ProgressBarModule} from "primeng/progressbar";
import {FileUpload, FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {Toast, ToastModule} from "primeng/toast";
import {CommonModule} from "@angular/common";
import {Avatar} from "primeng/avatar";
import {Card} from "primeng/card";
import {AnalyzeRequestParams} from "../../../models/Benutzer";
import {ProductService} from "../../../app/services/product.service";
import {InputText} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {FloatLabel} from "primeng/floatlabel";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {Tooltip} from "primeng/tooltip";

@Component({
  selector: 'katalog-import-form',
  standalone: true,
  templateUrl: './katalog-import-form.component.html',
  imports: [
    CommonModule, ProgressBarModule, ProgressBar, Button, Toast, FileUpload, Badge,
    ButtonModule, ToastModule, FileUploadModule, BadgeModule, Avatar, Card, InputText, FormsModule, FloatLabel, InputGroup, InputGroupAddon, Tooltip
  ],
  styleUrl: './katalog-import-form.component.css',
  providers: [MessageService]
})
export class KatalogImportFormComponent {
  messageService = inject(MessageService);
  productService = inject(ProductService);

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

    await fetch('/api/v1//admin/analyze', {
      body: JSON.stringify({fileUrls: fileUrls, type: ''} as AnalyzeRequestParams),
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
    })
    this.productService.reload();
  }

  choose() {
    this.$up()?.choose();
  }

  async setKIData() {
    await fetch('/api/v1/admin/updateUser', {
        method: 'POST',
        body: JSON.stringify({openApiToken: this.$token(), openApiUrl: this.$url()}),
        headers: {'Content-Type': 'application/json'}
      }
    )
  }
}
