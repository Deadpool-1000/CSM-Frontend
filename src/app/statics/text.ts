export const Text = {
    LOGIN_SUCCESS: "Login Successful.",
    SUCCESS: "Success",
    ERROR: "Error",
    LOGIN_TO_CONTINUE: "Please Login to Continue.",
    PASSWORD_MISMATCH: "Password and Confirm Password do not match.",
    NEW_TICKET: "Ticket Raised Successfully.",
    LOGOUT: "Logout Successful.",
    FEEDBACK_SUCCESS: "Feedback registered Succesfully for ticket #",
    TICKET_OPERATION_SUCCESS: "Ticket#{ticketId} {operation} successfully.",
    MESSAGE_FROM_MGR: "Added note to helpdesk for ticket#",
    BASE_URL: "http://localhost:5000",
    get LOGIN_URL(){
        return `${this.BASE_URL}/login`
    },
    get SIGNUP_URL(){
        return `${this.BASE_URL}/signup`
    },
    get PROFILE_URL(){
        return `${this.BASE_URL}/profile`
    },
    get LOGOUT_URL(){
        return `${this.BASE_URL}/logout`
    },
    get TICKETS_URL(){
        return `${this.BASE_URL}/tickets`
    },
    get TICKET_URL(){
        return `${this.BASE_URL}/tickets/{ticket_id}`
    },
    get MESSAGE_URL(){
        return `${this.TICKETS_URL}/{ticket_id}/message`
    },
    get FEEDBACK_URL(){
        return `${this.TICKET_URL}/feedback`
    },
    get CLOSE_TICKET_URL(){
        return `${this.TICKET_URL}/close`
    },
    get RESOLVE_TICKET_URL(){
        return `${this.TICKET_URL}/resolve`
    },
    ASC: 'asc',
    DSC: 'dsc',
    RAISED: 'raised',
    IN_PROGRESS: 'in_progress',
    CLOSED: 'closed',
    PROFILE_UPDATE_SUCCESS: "Profile updated Successfully."
}