import { fetchApi } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { UserProfile } from "@/lib/types/user";
export async function POST(request: NextRequest) {
  const { address, token } = await request.json();
  const user = await fetchApi<UserProfile>(`user/profile?address=${address}`, {
    method: "GET",
    token,
  });
   const avatarUrlObj = await fetchApi<{
       data: {
           url: string 
       }
}>(
     `upload/get-temp-url?id=2f0b04cc-b5b8-422b-be63-2d71c872e436`,
     {
       method: "GET",
     }
   );
    console.log("avatarUrlObj", avatarUrlObj);
      user.avatarUrl = avatarUrlObj.data.url;
      
  return NextResponse.json(user);
}
