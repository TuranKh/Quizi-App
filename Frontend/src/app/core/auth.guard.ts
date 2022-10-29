import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from "../services/auth.service";


@Injectable({
  providedIn: 'root',
})

export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private auth: AuthService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
    }
    return true;
  }
}