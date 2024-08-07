'use client';
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Error() {
	const searchParams = useSearchParams();
	const errorMsg = searchParams.get("error");

	return (
		<h3 className="text-red-400 font-bold text-center p-5">
			{errorMsg}
		</h3>
	)
}

export default function Page() {
	const router = useRouter();
	
	return (
		<div>
			<Suspense>
				<Error />
			</Suspense>

			<h1 className="text-center text-2xl font-bold">
				Bookance
			</h1>
			<h3 className="text-center text-lg font-medium">
				Ask questions about literary texts. Quotes provided.
			</h3>

			<p className="mt-5 mb-2 text-center text-base">Sign in with your school email:</p>
			<div className="w-full flex flex-row justify-center">
				<motion.div
					className="text-center border-black border-2 rounded-lg p-2 w-fit"
					initial={{ scale: 1 }}
					whileHover={{ scale: 1.08, backgroundColor: "#000000", color: "#ffffff"}}
					whileTap={{ scale: 0.92 }}
					onTap={async () => { router.push("/login/google") }}
				>
						<span>
						Sign in with Google
						</span>
				</motion.div>
			</div>
		</div>
	);
}