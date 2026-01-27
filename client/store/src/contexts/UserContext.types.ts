
export interface User {
    id: number,
    name: string,
    surname: string,
    role: string,
    email: string,
}



export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loadingUser: boolean;
    setLoadingUser: (value: boolean) => void;
  }
  