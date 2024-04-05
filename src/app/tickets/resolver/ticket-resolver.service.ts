import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { TicketService } from "../services/tickets.services";
import { inject } from "@angular/core";
import { TicketDetailModel } from "../models/ticket.model";
import { Observable } from "rxjs";
import {tap} from 'rxjs/operators';
import { LoadingService } from "../../services/loading.service";


export const TicketResolver: ResolveFn<Observable<TicketDetailModel>|Promise<boolean>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<TicketDetailModel>|Promise<boolean> =>{
    const ticketService = inject(TicketService);
    const loadingService = inject(LoadingService);
    
    loadingService.isLoading.next(true);
    const router = inject(Router)
    const ticket_id = route.paramMap.get('id');
    if(ticket_id){
        return ticketService.getTicketDetail(ticket_id).
        pipe(
            tap(
                _=>{
                    loadingService.isLoading.next(false)
                }
            )
        )
    }
    loadingService.isLoading.next(false);
    return router.navigate(['/not-found']);
}   