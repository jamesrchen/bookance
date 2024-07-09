import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/app/lib/auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { db, sql } from "@vercel/postgres";
import * as jose from 'jose'

// https://www.youtube.com/watch?v=H-msUYltDbs - For google oauth

interface GoogleUser {
  sub: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return Response.redirect(`${process.env.BASE_URL}/login`);
  }

  const codeVerifier = cookies().get("codeVerifier")?.value;
  const savedState = cookies().get("state")?.value;

  if (!codeVerifier || !savedState) {
    return Response.redirect(`${process.env.BASE_URL}/login`);
  }

  if(savedState !== state) {
    return Response.redirect(`${process.env.BASE_URL}/login`);
  }

  const { accessToken, idToken } = await google.validateAuthorizationCode(code, codeVerifier);

  try {
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      method: "GET"
    });
  
    const user: GoogleUser = await googleRes.json();
  
    if (!user.email || !user.name || !user.picture) {
      console.error("Invalid user data", user);
      return
    }

    if(process.env.VALID_EMAIL) {
      if (!user.email.endsWith(process.env.VALID_EMAIL)) {
        console.error("User with invalid email domain (", user.email, ") attempted to login");
        const params = new URLSearchParams({ error: "Invalid email domain" });
        return Response.redirect(`${process.env.BASE_URL}/login?${params.toString()}`);
      }
    }


    // Check if user is already in the database
    const data = await sql`SELECT * FROM users WHERE id = ${user.sub}`;
    if (data.rows.length === 0) {
      await sql`INSERT INTO users (id, email, name, picture) VALUES (${user.sub}, ${user.email}, ${user.name}, ${user.picture})`;
    }
  
    // Set JWT token
    const jwt = await new jose.SignJWT({ id: user.sub })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
  
    cookies().set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  
    return Response.redirect(`${process.env.BASE_URL}/`)
    // .headers.set(
    //   'Set-Cookie',
    //   `token = ${jwt}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=7200;`
    // );
  } catch (error) {
    console.error(error);
    return Response.redirect(`${process.env.BASE_URL}/`);
  }
}

// https://accounts.google.com/signin/oauth/error/v2?authError=ChVyZWRpcmVjdF91cmlfbWlzbWF0Y2gSsAEKWW91IGNhbid0IHNpZ24gaW4gdG8gdGhpcyBhcHAgYmVjYXVzZSBpdCBkb2Vzbid0IGNvbXBseSB3aXRoIEdvb2dsZSdzIE9BdXRoIDIuMCBwb2xpY3kuCgpJZiB5b3UncmUgdGhlIGFwcCBkZXZlbG9wZXIsIHJlZ2lzdGVyIHRoZSByZWRpcmVjdCBVUkkgaW4gdGhlIEdvb2dsZSBDbG91ZCBDb25zb2xlLgogIBptaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvcHJvdG9jb2xzL29hdXRoMi93ZWItc2VydmVyI2F1dGhvcml6YXRpb24tZXJyb3JzLXJlZGlyZWN0LXVyaS1taXNtYXRjaCCQAyo-CgxyZWRpcmVjdF91cmkSLmh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvYXV0aC9nb29nbGUvY2FsbGJhY2sypAIIARKwAQpZb3UgY2FuJ3Qgc2lnbiBpbiB0byB0aGlzIGFwcCBiZWNhdXNlIGl0IGRvZXNuJ3QgY29tcGx5IHdpdGggR29vZ2xlJ3MgT0F1dGggMi4wIHBvbGljeS4KCklmIHlvdSdyZSB0aGUgYXBwIGRldmVsb3BlciwgcmVnaXN0ZXIgdGhlIHJlZGlyZWN0IFVSSSBpbiB0aGUgR29vZ2xlIENsb3VkIENvbnNvbGUuCiAgGm1odHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9pZGVudGl0eS9wcm90b2NvbHMvb2F1dGgyL3dlYi1zZXJ2ZXIjYXV0aG9yaXphdGlvbi1lcnJvcnMtcmVkaXJlY3QtdXJpLW1pc21hdGNo&client_id=1021241589297-ki3q3jjrssfkr0141e39qt16qd142fhe.apps.googleusercontent.com&flowName=GeneralOAuthFlow