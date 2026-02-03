export interface InputProps {
  name: string,
  label?: string | React.ReactNode;
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  value?: string;
  readonly?:boolean;
  className?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}