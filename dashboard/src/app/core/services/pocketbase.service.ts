import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PocketbaseService {
  private readonly pb = new PocketBase(environment.pocketbaseUrl);

  getInstance(): PocketBase {
    return this.pb;
  }

  getBaseUrl(): string {
    return environment.pocketbaseUrl;
  }

  isAuthenticated(): boolean {
    return this.pb.authStore.isValid && !!this.pb.authStore.record;
  }

  clearAuth(): void {
    this.pb.authStore.clear();
  }
}
