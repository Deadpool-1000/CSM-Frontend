import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketDetailModel } from '../models/ticket.model';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { FeedbackService } from '../../feedback/feedback.service';
import { FeedbackModel, MgrFeedbackModel } from '../../models/feedback.model';
import { MessageFromMgrService } from '../../message-from-mgr/message-from-mgr.service';
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
    private authService: AuthService, 
    private feedbackService: FeedbackService,
    private messageFromMgrService: MessageFromMgrService,
    private router: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    // this.loadingService.isLoading.next(true);
    this.ticket = this.activatedRoute.snapshot.data['ticket'];

    this.userSubscription = this.authService.currentUser.subscribe({
      next: user=>{
        this.currentUser = user
      },
      error: error=>{
        this.messageService.add({
          severity: 'error',
          detail: "You can't access this route."
        })
        this.router.navigate(['/'])
      }
  })

    this.feedbackSubscription = this.feedbackService.getFeedback(
      this.ticket.ticket_id
    ).subscribe({
      next: feedback=>{
        this.feedback = feedback;
      },
      error: error=>{
        this.feedback = null;
      }
    })

    this.messageSubscription = this.messageFromMgrService.getMessageFromMgr(
      this.ticket.ticket_id
    ).subscribe({
        next: message => {
          this.messageFromMgr = message;
        },
        error: error=>{
          this.messageFromMgr = null;
        }
    })
    
    
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
    this.userSubscription.unsubscribe();
    this.feedbackSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }
}
