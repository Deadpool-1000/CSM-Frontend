import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { MessageService } from "primeng/api";
import { take, map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

export function allowedUsers (...roles: string[]): CanActivateFn {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const messageService = inject(MessageService);

        return authService.currentUser.pipe(
            take(1),
            map(
                (user)=>{
                    if(user){
                        const isAllowed = roles.indexOf(user.role) !== -1;
                        if (isAllowed){
                            return true;
                        }
                    }
                    messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'You do not have permission to access this route.'
                    })
                    return router.createUrlTree(['tickets'])
                }
            )
        )
    }
}