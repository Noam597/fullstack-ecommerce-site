export interface User{
    id?:number
    name:string; 
    surname:string; 
    role:string; 
    email:string; 
    password:string;
    is_banned:boolean;
}

export interface UsersState{
    userId: number | null
    users:User[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null
}

