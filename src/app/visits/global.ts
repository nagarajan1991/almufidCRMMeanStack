import { InjectionToken } from '@angular/core';
import { User } from '../auth/user.model';

export class Global {
    user: User = null;
}

export const GLOBALS = new InjectionToken<Global>('GLOBALS');
