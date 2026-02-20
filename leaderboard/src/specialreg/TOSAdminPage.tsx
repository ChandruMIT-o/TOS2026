import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { Navigate } from "react-router-dom";
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
	getDoc,
} from "firebase/firestore";
import { useLoading } from "../context/LoadingContext";

export default function TOSAdminPage() {
	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const [permissionGranted, setPermissionGranted] = useState(false);
	const { setPageLoaded } = useLoading();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (!currentUser) {
				setLoading(false);
				return;
			}
			try {
				const userRef = doc(db, "users", currentUser.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					if (userSnap.data()?.tos_admin === true) {
						setIsAdmin(true);
					}
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
				setPageLoaded(true);
			}
		});

		return () => unsubscribe();
	}, [setPageLoaded]);

	if (loading) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-mono animate-pulse">
				VERIFYING ADMIN CREDENTIALS...
			</div>
		);
	}

	if (!isAdmin) {
		return <Navigate to="/" replace />;
	}

	const handleGrantPermission = async (e: React.FormEvent) => {
		e.preventDefault();
		setPermissionGranted(false);
		setError("");

		// Simple validation to trigger the error text
		const email = inputValue.trim();
		if (!email) {
			setError("ERROR: IDENTIFIER CANNOT BE EMPTY!");
			return;
		}

		if (email.length < 5) {
			setError("ERROR: INPUT MUST BE AT LEAST 5 CHARACTERS LONG!");
			return;
		}

		try {
			// Find the user by email
			const q = query(
				collection(db, "users"),
				where("email", "==", email),
			);
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				setError(`ERROR: NO OPERATIVE FOUND WITH EMAIL ${email}`);
				return;
			}

			// Update the tos_registered field
			const userDoc = querySnapshot.docs[0];
			const userRef = doc(db, "users", userDoc.id);

			await updateDoc(userRef, {
				tos_registered: true,
			});

			setPermissionGranted(true);
			setInputValue(""); // clear on success
		} catch (error: any) {
			console.error("Error granting permission:", error);
			setError("CRITICAL ERROR: DATABASE UPDATE FAILED.");
		}
	};

	return (
		<div className="min-h-screen bg-yellow-300 flex items-center justify-center p-6 font-mono text-black">
			{/* Neo-brutalist Card */}
			<div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
				<h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">
					System Access
				</h1>
				<p className="text-lg font-bold mb-8 uppercase border-b-4 border-black pb-2">
					Registration Node [ADMIN]
				</p>

				<form
					onSubmit={handleGrantPermission}
					className="flex flex-col gap-6"
				>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="user-input"
							className="text-xl font-bold uppercase"
						>
							Enter Operative Email
						</label>
						<input
							id="user-input"
							type="email"
							value={inputValue}
							onChange={(e) => {
								setInputValue(e.target.value);
								if (error || permissionGranted) {
									setError("");
									setPermissionGranted(false);
								}
							}}
							placeholder="operative@tos.com"
							className="w-full bg-white border-4 border-black p-4 text-lg font-bold placeholder-gray-400 focus:outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
						/>
					</div>

					{/* Error Text Block */}
					{error && (
						<div className="bg-red-400 border-4 border-black p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
							<span className="text-black font-black uppercase text-sm md:text-base break-words">
								{error}
							</span>
						</div>
					)}

					{/* Success Text Block */}
					{permissionGranted && (
						<div className="bg-emerald-400 border-4 border-black p-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
							<span className="text-black font-black uppercase text-sm md:text-base break-words">
								SUCCESS: PERMISSION GRANTED!
							</span>
						</div>
					)}

					{/* Action Button */}
					<button
						type="submit"
						className="w-full bg-cyan-400 mt-4 border-4 border-black p-4 text-2xl font-black uppercase hover:bg-cyan-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-[10px] active:translate-y-[10px] active:shadow-none transition-all cursor-pointer"
					>
						Grant Permission
					</button>
				</form>
			</div>
		</div>
	);
}
