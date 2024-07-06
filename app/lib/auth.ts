import { db, sql } from "@vercel/postgres";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { cache } from "react";
import { verify } from "jsonwebtoken";
import * as jose from 'jose'
import { User } from "@/app/lib/definitions";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!,
)

export const validateRequest = cache(
  async (): Promise<string | null > => {
    const jwt = cookies().get("token")?.value;
    if (!jwt) {
      return null;
    }

    try {
      const { payload, protectedHeader } = await jose.jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET!))
  
      if ( !payload.id ) {
        return null;
      }
  
      let data = await sql<User>`SELECT * FROM users WHERE id = ${payload.id as string}`
      if (data.rows.length === 0) {
        console.error(`User ${payload.id} not found in database`)
        return null;
      }
  
      // console.log({payload, protectedHeader})
      return payload.id as string
    } catch (error) {
      return null
    }
  }
)

