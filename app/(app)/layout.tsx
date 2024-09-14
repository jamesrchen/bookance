import { validateRequest } from "@/app/lib/auth";
import { fetchUserInfo } from "@/app/lib/data";
import Navigation from "@/app/ui/navigation";
import { redirect } from "next/navigation";
import { FaHammer, FaRegLightbulb } from "react-icons/fa";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = await validateRequest();
  if(!user){
    return redirect("/login");
  }

  return (
    <>
    <div className="">
      <Navigation user={user}/>
      <div className="border-b-2 border-gray-300 rounded-b-lg flex flex-row flex-wrap lg:flex-nowrap gap-2 py-2 px-4 items-center">
        <FaRegLightbulb />
        <span className="break-words">
          Check out mugmug, a questionbank and revision tracker. <a href="https://mugmug.jrc.sh" className="underline">mugmug.jrc.sh</a>
        </span>
      </div>
    </div>

      {children}
    </>
  )
}