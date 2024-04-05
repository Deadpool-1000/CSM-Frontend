export interface FeedbackModel{
    ticket_id: string;
    description: string;
    created_on: string;
    stars: number;
}

export interface MgrFeedbackModel{
    ticket_id: string;
    message: string;
    created_at: string;
}