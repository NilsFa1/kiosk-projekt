import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { BenutzerSmall } from "../../models/Benutzer";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public router = inject(Router)
  public $user = signal<BenutzerSmall | undefined>(undefined)
  public $loggedIn = computed(() => this.$user() != undefined);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }
    try {
      const user = jwtDecode<BenutzerSmall>(token);
      this.$user.set(user);
      localStorage.setItem('auth_token', token);
      return;
    } catch (err) {
      console.error('Fehler beim Dekodieren des Tokens:', err);

    }
  }

  public async logIn(name: string, password: string) {
    const result = await fetch('/api/v1/login', {
      body: JSON.stringify({ name, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    if (!result.ok) {
      return false;
    }

    const token = (await result.text()) as string;
    try {
      const user = jwtDecode<BenutzerSmall>(token);
      this.$user.set(user);
      localStorage.setItem('auth_token', token);
      return user;
    } catch (err) {
      console.error('Fehler beim Dekodieren des Tokens:', err);
      return null;
    }
  }

  public async logOut() {
    localStorage.removeItem('auth_token');
    this.$user.set(undefined);
    await this.router.navigate(['/']);
  }
}
