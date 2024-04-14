import { Pipe, PipeTransform } from '@angular/core';
import { TicketModel } from '../../models/ticket.model';


@Pipe({
    name: 'filterBy'
  })
  export class FilterByPipe implements PipeTransform {
  
    transform(tickets: TicketModel[],status?: "raised"|"closed"|"in_progress"): TicketModel[] {
        if(status){
            return tickets.filter(
                (ticket)=>{
                  return ticket.status === status
                }
              )
        }
        return tickets
    }
  
  }