import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { TicketService } from "../../services/tickets/tickets.services";
import { inject } from "@angular/core";
import { tap } from "rxjs/operators";
import { LoadingService } from "../../services/loading/loading.service";

export const TicketsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any=> {
    const ticketsService = inject(TicketService);
    const loadingService = inject(LoadingService);
    loadingService.isLoading.next(true);
    
    return ticketsService.getAllTickets().pipe(
        tap(
            _=>{
                loadingService.isLoading.next(false);
            }
        )
    );

}