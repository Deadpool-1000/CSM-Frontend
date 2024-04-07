import { Pipe, PipeTransform } from '@angular/core';
import { TicketModel } from '../models/ticket.model';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(tickets: TicketModel[],order: "asc"|"dsc"): TicketModel[] {
    return tickets.sort(
      (a,b)=>{
        if(order === 'asc'){
          return new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
        } else if(order === 'dsc') {
          return new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
        }
        else {
          return 0;
        }
      }
    )
  }

}
