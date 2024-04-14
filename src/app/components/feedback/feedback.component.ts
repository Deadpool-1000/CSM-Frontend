import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { FeedbackService } from '../../services/feedback.service';
import { NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Text } from '../../statics/text';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  standalone: true,
  imports: [FormsModule, RatingModule, NgIf],
  providers: [FeedbackService]
})
export class FeedbackComponent implements OnInit, OnDestroy {
  stars: number = 1;
  ticket_id: string;
  isLoading = false;
  description: string;
  feedbackSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private feedbackService: FeedbackService,
    private router: Router,
    private messageService: MessageService
  ) {
    const stateData = this.router.getCurrentNavigation()?.extras.state;
    if (stateData) {
      const { stars, description } = stateData['feedback'];
      this.stars = stars;
      this.description = description;
    }
  }

  ngOnInit(): void {
    this.ticket_id = this.activatedRoute.snapshot.params['id'];
  }

  handleSubmit(feedbackForm: NgForm) {
    const { description, stars } = feedbackForm.value;
    this.isLoading = true;

    this.feedbackSubscription = this.feedbackService.registerFeedback(this.ticket_id, stars, description).subscribe({
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
        this.isLoading = false;
      },
      complete: ()=>{
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: Text.SUCCESS,
          detail: `${Text.FEEDBACK_SUCCESS}${this.ticket_id}`
        });
        this.router.navigate(['tickets', this.ticket_id])
      }
    })
  }


  ngOnDestroy(): void {
    if(this.feedbackSubscription)
      this.feedbackSubscription.unsubscribe();
  }
}
