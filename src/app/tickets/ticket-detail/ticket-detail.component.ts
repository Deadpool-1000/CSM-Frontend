import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketDetailModel } from '../../models/ticket.model';
import { UserModel } from '../../models/user.model';
import { FeedbackModel, MgrFeedbackModel } from '../../models/feedback.model';


@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit{
  ticket!: TicketDetailModel;
  currentUser!: UserModel | null;
  feedback: FeedbackModel | null;
  messageFromMgr: MgrFeedbackModel| null;


  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router,
  ){}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      ({ticket})=>{
        if(ticket['currentUser']) this.currentUser = ticket['currentUser']
        if(ticket['ticket']) this.ticket = ticket['ticket'];
        if(ticket['feedback']) this.feedback = ticket['feedback']
        if(ticket['messageFromMgr']) this.messageFromMgr = ticket['messageFromMgr']
      }
    )
  }

  onAddOrEditFeedback(){
    this.router.navigate(['tickets', this.ticket.ticket_id, 'feedback'], {
      state: {
        feedback: this.feedback
      }
    })
  }
}
