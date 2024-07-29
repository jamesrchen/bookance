import BookSearchBar from "@/app/ui/bookSearchBar";
import { sql } from "@vercel/postgres";
import { getPageFiles } from "next/dist/server/get-page-files";
import Markdown from "react-markdown"

interface book {
  corpus: string;
  page: number;
  content: string;
}

export default async function Page({
  searchParams, 
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  async function getPages(search: string, corpus: string) {
    if (search.length < 3) return [];
    // get server time
    let { rows } = await sql<book>`select * from books where corpus = ${corpus} AND content ILIKE ${`%${search}%`} ORDER BY PAGE ASC LIMIT 50`;;
    return rows;
  }

  let search = searchParams?.search;
  let corpus = searchParams?.corpus;
  let timeStart = new Date().getTime();
  let results = search && corpus ? await getPages(search, corpus) : [];
  let timeEnd = new Date().getTime();

  return (
    <div className="flex flex-col px-10 lg:px-40 py-10">

      <BookSearchBar />

      {
        results.map((page) => (
          <div key={page.page} className="border rounded-md p-2 my-1">
            <div className="flex flex-row gap-2">
              <span className="font-bold text-black">{page.corpus}</span>
              <span className="text-gray-600"> Page {page.page}</span>
            </div>
            <hr/>
            <Markdown className="indent-2">{
              // replace all instances of the search term with a highlighted version (add * to the front and back)
              page.content.replace(new RegExp(search ?? '', 'gi'), (match) => `**${match}**`)
            }</Markdown>
          </div>
        ))
      }
      <small>Search took {timeEnd - timeStart}ms</small>
    </div>
  );
}