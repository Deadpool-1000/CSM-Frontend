import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketDetailModel } from '../models/ticket.model';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { FeedbackService } from '../../services/feedback.service';
import { FeedbackModel, MgrFeedbackModel } from '../../models/feedback.model';
import { MessageFromMgrService } from '../../services/message-from-mgr.service';
import { Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket!: TicketDetailModel;
  currentUser!: UserModel | null;
  feedback: FeedbackModel | null;
  messageFromMgr: MgrFeedbackModel| null;
  userSubscription!: Subscription;
  feedbackSubscription!: Subscription;
  messageSubscription!: Subscription;


  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router,
  ){}

  ngOnInit(): void {
    // this.loadingService.isLoading.next(true);
    this.activatedRoute.data.subscribe(
      ({ticket})=>{
        console.log(ticket);
        if(ticket['currentUser']) this.currentUser = ticket['currentUser']
        if(ticket['ticket']) this.ticket = ticket['ticket'];
        if(ticket['feedback']) this.feedback = ticket['feedback']
        if(ticket['messageFromMgr']) this.messageFromMgr = ticket['messageFromMgr']
      }
    )
  }

  onAddOrEditFeedback(){
    console.log(this.feedback)
    this.router.navigate(['tickets', this.ticket.ticket_id, 'feedback'], {
      state: {
        feedback: this.feedback
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription)
      this.userSubscription.unsubscribe();
  }
}
