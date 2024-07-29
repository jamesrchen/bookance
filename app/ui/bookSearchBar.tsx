'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Corpus, CorpusName } from "@/app/lib/definitions";
import { corpora } from "@/config";
import clsx from "clsx";

export default function BookSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  let corpus: CorpusName[] = Object.keys(corpora) as CorpusName[];

  const handleSearch = useDebouncedCallback((search: string) => {
    if (search.length < 3) return;
    const params = new URLSearchParams(searchParams);
    params.set('search', search);
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div>
      <input className="border-black border-2 w-full h-10 rounded-lg p-2"
        type="text" 
        placeholder="Search for a quote" 
        onChange={
          (e) => {
            handleSearch(e.target.value);
          }  
        }
        defaultValue={searchParams.get('search')?.toString()}
        // value={question} 
        // onChange={(e) => {setQuestion(e.target.value)}}
      />

      <div className="flex flex-row flex-wrap gap-2 mt-2">
        {
          // Create button for each corpus
          corpus.map((corpus) => {
            return (
              <button key={corpus} onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('corpus', corpus);
                replace(`${pathname}?${params.toString()}`);
              }} className={clsx("border-black border-2 rounded-lg p-2", 
                corpus === searchParams.get('corpus') ? "bg-black text-white" : "bg-white text-black"
              )}>
                {corpus}
              </button>
            )
          })
        }
      </div>
    </div>
  )
}