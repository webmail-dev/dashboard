import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthPocketbaseService } from '../services/auth-pocketbase.service';

export const adminAuthGuard: CanActivateFn = async () => {
  const auth = inject(AuthPocketbaseService);
  const router = inject(Router);
  const user = auth.getCurrentUser() || (await auth.refreshSession());

  if (!user || auth.isBlockedOrInactive(user) || !auth.hasAdminAccess(user)) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
