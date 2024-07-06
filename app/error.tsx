'use client';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center align-middle gap-2">
      <Image src="/500.png" width={512} height={512} alt="500 Internal Server Error" />
      <button
        className="mt-4 rounded-md px-4 py-2 text-sm  transition-colors border-black border-2 hover:bg-black hover:text-white"
        onClick={
          () => reset()
        }
      >
        Try Again
      </button>
      <p>If this persists, contact James. Error detailed as follows:</p>
      <p className="text-gray-500 text-sm">{error.message}</p>
    </main>
  );
}