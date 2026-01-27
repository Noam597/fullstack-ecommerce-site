export interface signUpProps{
    onSignUp: (username:string,
               surname:string,
               email:string,
               password:string,
               verifyPassword:string,
        )=> void;
    error?: string;
}