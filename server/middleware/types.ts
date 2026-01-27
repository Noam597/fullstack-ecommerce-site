export interface User {
    id: string;
    name: string;
    email: string;
    role: "buyer" | "manager" | "admin";
  }