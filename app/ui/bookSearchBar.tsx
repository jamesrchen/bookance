'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function BookSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((search: string) => {
    if (search.length < 3) return;
    const params = new URLSearchParams(searchParams);
    params.set('search', search);
    replace(`${pathname}?${params.toString()}`);
  }, 150);

  return (
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
  )
}