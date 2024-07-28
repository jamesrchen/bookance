import { validateRequest } from "@/app/lib/auth";
import { fetchLines, intextSearch } from "@/app/lib/data";
import { CorpusName } from "@/app/lib/definitions";
import { corpora } from "@/config";
import clsx from "clsx";
import Link from "next/link";
import Markdown from "react-markdown";

export default async function Page({
  searchParams, 
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  let userID = await validateRequest();

  if (!userID) {
    return <div>User not authenticated</div>;
  }

  let corpus = searchParams?.corpus;
  // check if it is a key of corpora
  if(!corpus || !Object.keys(corpora).includes(corpus)) {
    return <div>Corpus is required</div>;
  }

  let search = searchParams?.search;

  if (!search) {
    return <div>Search is required</div>;
  }

  const data = await intextSearch(corpus as CorpusName, search);

  return (
    <div className="p-6 lg:p-16 pt-2 lg:pt-2">
      {/* Back to homepage */}
      <Link className="text-xl font-bold mb-12" href="/"> {`< Back`} </Link>
      {/* <h1 className="">Search Results:</h1> */}
      <div className="flex flex-col gap-2">
        {data.map(({line: selectedLine}) => (
          <div key={corpus+"selected"+selectedLine.toString()} className="border rounded-md p-2 [&_p]:my-1 [&_p]:indent-2">
            {
              fetchLines(corpus as CorpusName, selectedLine - 3, selectedLine + 3).then((lines) => {
                return lines.map(({line, content}) => (
                  <p key={corpus + line.toString()} className={clsx(
                    line === selectedLine ? "font-bold text-black" : "text-gray-600"
                  )}>
                    {content}
                  </p>

                ));
              })
            }
          </div>
        ))}
      </div>
    </div>
  );
}