import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {PrimeNG} from "primeng/config";
import {Translation} from "primeng/api";
import {NotificationsService} from "./services/notifications.service";
import {UiService} from "./services/ui.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `
    <router-outlet/>
  `,
  styles: `
    :host {
      max-width: 1280px;
      text-align: center;
    }`
})
export class App {
  private config = inject(PrimeNG);
  #_ = inject(NotificationsService);
  #__ = inject(UiService)

  constructor() {
    this.config.setTranslation({
      accept: "Ja",
      "addRule": "Regel hinzufügen",
      "am": "am",
      "apply": "Übernehmen",
      "cancel": "Abbrechen",
      "choose": "Auswählen",
      "chooseDate": "Datum wählen",
      "chooseMonth": "Monat wählen",
      "chooseYear": "Jahr wählen",
      "clear": "Löschen",
      "completed": "Abgeschlossen",
      "contains": "Enthält",
      "custom": "Benutzerdefiniert",
      "dateAfter": "Datum ist nach",
      "dateBefore": "Datum ist vor",
      "dateFormat": "dd.mm.yy",
      "dateIs": "Datum ist",
      "dateIsNot": "Datum ist nicht",
      "dayNames": [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"
      ],
      "dayNamesMin": [
        "So",
        "Mo",
        "Di",
        "Mi",
        "Do",
        "Fr",
        "Sa"
      ],
      "dayNamesShort": [
        "Son",
        "Mon",
        "Die",
        "Mit",
        "Don",
        "Fre",
        "Sam"
      ],
      "emptyFilterMessage": "Keine Ergebnisse gefunden",
      "emptyMessage": "Keine Einträge gefunden",
      "emptySearchMessage": "Keine Ergebnisse gefunden",
      "emptySelectionMessage": "Kein ausgewähltes Element",
      "endsWith": "Endet mit",
      "equals": "Ist gleich",
      "fileSizeTypes": [
        "B",
        "KB",
        "MB",
        "GB",
        "TB",
        "PB",
        "EB",
        "ZB",
        "YB"
      ],
      "filter": "Filtern",
      "firstDayOfWeek": 1,
      "gt": "Größer als",
      "gte": "Größer oder gleich",
      "lt": "Kleiner als",
      "lte": "Kleiner oder gleich",
      "matchAll": "Passt auf alle",
      "matchAny": "Passt auf einige",
      "medium": "Mittel",
      "monthNames": [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
      ],
      "monthNamesShort": [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez"
      ],
      "nextDecade": "Nächstes Jahrzehnt",
      "nextHour": "Nächste Stunde",
      "nextMinute": "Nächste Minute",
      "nextMonth": "Nächster Monat",
      "nextSecond": "Nächste Sekunde",
      "nextYear": "Nächstes Jahr",
      "noFilter": "Kein Filter",
      "notContains": "Enthält nicht",
      "notEquals": "Ist ungleich",
      "now": "Jetzt",
      "passwordPrompt": "Passwort eingeben",
      "pending": "Ausstehend",
      "pm": "pm",
      "prevDecade": "Vorheriges Jahrzehnt",
      "prevHour": "Vorherige Stunde",
      "prevMinute": "Vorherige Minute",
      "prevMonth": "Vorheriger Monat",
      "prevSecond": "Vorherige Sekunde",
      "prevYear": "Vorheriges Jahr",
      "reject": "Nein",
      "removeRule": "Regel entfernen",
      "searchMessage": "{0} Ergebnisse verfügbar",
      "selectionMessage": "{0} Elemente ausgewählt",
      "showMonthAfterYear": false,
      "startsWith": "Beginnt mit",
      "strong": "Stark",
      "today": "Heute",
      "upload": "Hochladen",
      "weak": "Schwach",
      "weekHeader": "KW",
      "aria": {
        "cancelEdit": "Änderungen abbrechen",
        "close": "Schließen",
        "collapseLabel": "Einklappen",
        "collapseRow": "Zeile reduziert",
        "editRow": "Zeile bearbeiten",
        "expandLabel": "Ausklappen",
        "expandRow": "Zeile erweitert",
        "falseLabel": "Falsch",
        "filterConstraint": "Filterbeschränkung",
        "filterOperator": "Filteroperator",
        "firstPageLabel": "Erste Seite",
        "gridView": "Rasteransicht",
        "hideFilterMenu": "Filtermenü ausblenden",
        "jumpToPageDropdownLabel": "Zum Dropdown-Menü springen",
        "jumpToPageInputLabel": "Zum Eingabefeld springen",
        "lastPageLabel": "Letzte Seite",
        "listView": "Listenansicht",
        "moveAllToSource": "Alle zur Quelle bewegen",
        "moveAllToTarget": "Alle zum Ziel bewegen",
        "moveBottom": "Zum Ende bewegen",
        "moveDown": "Nach unten bewegen",
        "moveTop": "Zum Anfang bewegen",
        "moveToSource": "Zur Quelle bewegen",
        "moveToTarget": "Zum Ziel bewegen",
        "moveUp": "Nach oben bewegen",
        "navigation": "Navigation",
        "next": "Nächste",
        "nextPageLabel": "Nächste Seite",
        "nullLabel": "Nicht ausgewählt",
        "otpLabel": "Bitte geben Sie das Einmalkennwortzeichen {0} ein.",
        "pageLabel": "Seite {page}",
        "passwordHide": "Passwort verbergen",
        "passwordShow": "Passwort anzeigen",
        "previous": "Vorherige",
        "previousPageLabel": "Vorherige Seite",
        "removeLabel": "Entfernen",
        "rotateLeft": "Nach links drehen",
        "rotateRight": "Nach rechts drehen",
        "rowsPerPageLabel": "Zeilen pro Seite",
        "saveEdit": "Änderungen speichern",
        "scrollTop": "Nach oben scrollen",
        "selectAll": "Alle Elemente ausgewählt",
        "selectLabel": "Auswählen",
        "selectRow": "Zeile ausgewählt",
        "showFilterMenu": "Filtermenü anzeigen",
        "slide": "Folie",
        "slideNumber": "{slideNumber}",
        "star": "1 Stern",
        "stars": "{star} Sterne",
        "trueLabel": "Wahr",
        "unselectAll": "Alle Elemente abgewählt",
        "unselectLabel": "Auswahl aufheben",
        "unselectRow": "Zeile abgewählt",
        "zoomImage": "Bild vergrößern",
        "zoomIn": "Vergrößern",
        "zoomOut": "Verkleinern"
      }
    } as Translation)
  }
}
