import { db, sql } from "@vercel/postgres";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { cache } from "react";
import * as jose from 'jose'
import { User, UserWithPremiumCheck } from "@/app/lib/definitions";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!,
)

export const validateRequest = cache(
  async (): Promise<UserWithPremiumCheck | null > => {
    console.log("Calling val")
    const jwt = cookies().get("token")?.value;
    if (!jwt) {
      return null;
    }

    try {
      const { payload, protectedHeader } = await jose.jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET!))
  
      if ( !payload.id ) {
        return null;
      }
  
      let data = await sql<User>`SELECT * FROM users WHERE id = ${payload.id as string}`;
      if (data.rows.length === 0) {
        console.error(`User ${payload.id} not found in database`)
        return null;
      }
      
      let user: UserWithPremiumCheck = {... data.rows[0], premium: false};
      if (user.premium_until && user.premium_until > new Date()) {
        user.premium = true;
      }
    
      return user;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch user info');
    }
  }
)