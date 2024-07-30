import Navigation from "@/app/ui/navigation";
import { FaRegLightbulb } from "react-icons/fa";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="">
      <Navigation />
      <div className="border-b-2 border-gray-300 rounded-b-lg flex flex-row flex-wrap lg:flex-nowrap gap-2 py-2 px-4 items-center">
        <FaRegLightbulb />
        <span className="break-words">
          Book search aims to help find you search for the exact page number of a quote. It is a work-in-progress and currently only supports WftB and DatM.
        </span>
      </div>
    </div>

      {children}
    </>
  )
}