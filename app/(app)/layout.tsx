import Navigation from "@/app/ui/navigation";
import { FaRegLightbulb } from "react-icons/fa";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className="border-b-2 border-gray-300 rounded-b-lg flex flex-row flex-wrap lg:flex-nowrap gap-2 py-2 px-4 items-center">
        <FaRegLightbulb />
        <span className="break-words">
          Book search aims to help find you search for the exact page number of a quote. It is currently a work-in-progress and only supports Waiting for the Barbarians.
          For any other queries, contact me at <a href="mailto:chen.wei.en.james.ryan@sji.edu.sg">chen.wei.en.james.ryan@sji.edu.sg</a>
        </span>
      </div>

      {children}
    </>
  )
}