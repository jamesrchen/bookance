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

			<div className="p-10 w-full flex flex-row justify-center">
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