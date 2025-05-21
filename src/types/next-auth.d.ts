import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    } & DefaultSession["user"]
  }

  interface User {
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    id: string;
  }
}
