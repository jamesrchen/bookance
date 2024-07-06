import { google } from "@/app/lib/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  cookies().set("codeVerifier", codeVerifier, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  cookies().set("state", state, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  const authorizationURL = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"]
  });
  
	return Response.redirect(authorizationURL.href);
}