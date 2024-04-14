import { Pipe, PipeTransform } from '@angular/core';
import { SortByValues, TicketModel } from '../../models/ticket.model';
import { Text } from '../../statics/text';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(tickets: TicketModel[],order?: SortByValues): TicketModel[] {
    if(order){
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
    return tickets.sort(
      (a,b)=>{
        return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
      }
    )
  }

}
