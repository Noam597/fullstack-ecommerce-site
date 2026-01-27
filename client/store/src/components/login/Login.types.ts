export interface loginProps{
    onLogin:(email:string, password:string)=> void;
    error?: string
}