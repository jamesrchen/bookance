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
          Book search aims to help find you search for the exact page number of a quote. It is a work-in-progress and currently only supports WftB and DatM.
        </span>
      </div>
      <div className="border-b-2 border-gray-300 rounded-b-lg flex flex-row flex-wrap lg:flex-nowrap gap-2 py-2 px-4 items-center">
        <FaHammer />
        <span className="break-words">
          Fixed an issue where the books were not directly referenced outside of LitCharts
        </span>
      </div>
    </div>

      {children}
    </>
  )
}