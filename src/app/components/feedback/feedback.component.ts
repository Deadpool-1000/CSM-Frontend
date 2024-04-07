import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { FeedbackService } from '../../services/feedback.service';
import { NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  standalone: true,
  imports: [FormsModule, RatingModule, NgIf],
  providers:[FeedbackService]
})
export class FeedbackComponent implements OnInit {
  stars: number = 1;
  ticket_id!: string | null;
  isLoading = false;
  description!: string | null

  constructor(private activatedRoute: ActivatedRoute, 
    private feedbackService: FeedbackService, 
    private router: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    const ticket_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.data.subscribe(
      data=>{
        const feedback = data['feedback'];
        if(feedback){
          const {stars, description} = feedback;
          this.stars = stars;
          this.description = description;
      }
    });

    this.ticket_id = ticket_id;
  }

  handleSubmit(feedbackForm: NgForm){
    const {description, stars} = feedbackForm.value;
    this.isLoading = true;

    this.feedbackService.registerFeedback(this.ticket_id, stars, description).subscribe({
      next: data=>{
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Feedback registered Succesfully.'
        });
        this.router.navigate(['tickets', this.ticket_id])
      },
      error: error=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
        this.isLoading = false;
        this.router.navigate(['tickets']);
      }
    })
  }


}
