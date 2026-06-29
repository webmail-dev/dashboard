import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RecordModel } from 'pocketbase';
import { DalePuesUser, UserType } from '../../models/auth.models';
import { PocketbaseService } from './pocketbase.service';

@Injectable({ providedIn: 'root' })
export class AuthPocketbaseService {
  private readonly pb = inject(PocketbaseService).getInstance();
  private readonly router = inject(Router);

  async login(email: string, password: string): Promise<DalePuesUser> {
    const authData = await this.pb.collection('users').authWithPassword(email, password);
    const user = this.toUser(authData.record);

    if (this.isBlockedOrInactive(user) || !this.hasAdminAccess(user)) {
      this.pb.authStore.clear();
      throw new Error('admin_access_denied');
    }

    await this.touchLastLogin(user.id);
    return this.getCurrentUser() || user;
  }

  logout(): void {
    this.pb.authStore.clear();
    void this.router.navigateByUrl('/login');
  }

  getCurrentUser(): DalePuesUser | null {
    const record = this.pb.authStore.record;
    return record ? this.toUser(record) : null;
  }

  isAuthenticated(): boolean {
    return this.pb.authStore.isValid && !!this.pb.authStore.record;
  }

  hasRole(type: UserType | UserType[]): boolean {
    const user = this.getCurrentUser();
    const allowedTypes = Array.isArray(type) ? type : [type];
    return !!user?.type && allowedTypes.includes(user.type);
  }

  hasAdminAccess(user: DalePuesUser | null = this.getCurrentUser()): boolean {
    return user?.type === 'admin' || user?.type === 'support';
  }

  isBlockedOrInactive(user: DalePuesUser | null): boolean {
    return user?.status === 'blocked' || user?.status === 'inactive';
  }

  async refreshSession(): Promise<DalePuesUser | null> {
    if (!this.pb.authStore.isValid) {
      this.pb.authStore.clear();
      return null;
    }

    try {
      const authData = await this.pb.collection('users').authRefresh();
      const user = this.toUser(authData.record);

      if (this.isBlockedOrInactive(user) || !this.hasAdminAccess(user)) {
        this.pb.authStore.clear();
        return null;
      }

      return user;
    } catch {
      this.pb.authStore.clear();
      return null;
    }
  }

  toFriendlyError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error || '');

    if (message.includes('admin_access_denied')) {
      return 'Esta cuenta no tiene permisos de administrador o soporte.';
    }

    if (message.includes('Failed to authenticate')) {
      return 'Correo o contraseña inválidos.';
    }

    return 'No fue posible iniciar sesión. Inténtalo nuevamente.';
  }

  private async touchLastLogin(userId: string): Promise<void> {
    try {
      const updated = await this.pb.collection('users').update(userId, {
        lastLoginAt: new Date().toISOString()
      });
      this.pb.authStore.save(this.pb.authStore.token, updated);
    } catch {
      // Non-critical. Auth must not fail if this audit field cannot be updated.
    }
  }

  private toUser(record: RecordModel): DalePuesUser {
    return {
      id: record.id,
      email: record['email'],
      name: record['name'],
      phone: record['phone'],
      type: record['type'],
      status: record['status'],
      avatar: record['avatar'],
      address: record['address'],
      city: record['city'],
      state: record['state'],
      country: record['country'],
      roleDescription: record['roleDescription'],
      lastLoginAt: record['lastLoginAt'],
      profileCompleted: record['profileCompleted'],
      termsAccepted: record['termsAccepted'],
      businessName: record['businessName'],
      businessType: record['businessType'],
      identityDocument: record['identityDocument'],
      vehicleType: record['vehicleType']
    };
  }
}
