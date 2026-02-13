import { createContext, useContext, useState, type ReactNode } from "react";

interface LoadingContextType {
	setPageLoaded: (loaded: boolean) => void;
	pageLoaded: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
	const [pageLoaded, setPageLoaded] = useState(false);

	return (
		<LoadingContext.Provider value={{ pageLoaded, setPageLoaded }}>
			{children}
		</LoadingContext.Provider>
	);
};

export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (!context)
		throw new Error("useLoading must be used within LoadingProvider");
	return context;
};
