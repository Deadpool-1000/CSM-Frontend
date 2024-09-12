import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { map, take } from "rxjs/operators";
import { MessageService } from "primeng/api";

export const isLoginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot)=>{
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(MessageService);
    return authService.isLoggedIn.pipe(
        take(1),
        map(
            (isLoggedIn)=>{
                if(isLoggedIn){
                    return true;
                }
                messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please Log in to continue.'
                });
                return router.createUrlTree(['auth', 'login']);
            }
        )
    )
}