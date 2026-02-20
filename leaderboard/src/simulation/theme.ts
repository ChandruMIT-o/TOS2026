const simulationThemeHigh = {
	colors: {
		bg: {
			main: "bg-background",
			loading: "bg-black",
			overlay: "bg-black/80",
			modal: "bg-zinc-900",
			nav: "bg-slate-200",
			statusBadge: "bg-white/50",
			buttonPrimary: "bg-yellow-300",
			buttonHover: "hover:bg-slate-100",
			navBtnHover: "hover:bg-black",
			header: "bg-slate-200",
			headerHover: "hover:bg-slate-100",
		},
		text: {
			main: "text-foreground",
			primary: "text-black",
			secondary: "text-zinc-400",
			accent: "text-emerald-500",
			title: "text-white",
			inverse: "text-black",
			navBtnHover: "hover:text-white",
		},
		border: {
			main: "border-black",
			accent: "border-emerald-500/50",
			button: "border-black",
		},
		shadow: {
			button: "shadow-[6px_6px_0px_#000]",
			buttonActive: "shadow-[2px_2px_0px_#000]",
			buttonHover: "shadow-[2px_2px_0px_#000]",
		},
		status: {
			online: "bg-emerald-500",
		},
		selection: "selection:bg-emerald-500/30",
		dither: {
			waveColor: [0.6, 0.4, 0.1] as [number, number, number],
		},
		panels: {
			bg: {
				base: "bg-zinc-950",
				surface: "bg-zinc-900",
				surfaceAlt: "bg-zinc-100",
				surfaceHover: "hover:bg-zinc-800",
				surfaceHoverAlt: "hover:bg-zinc-900",
				success: "bg-lime-400",
				warning: "bg-yellow-400",
				error: "bg-rose-500",
				info: "bg-cyan-400",
				accent: "bg-fuchsia-400",
			},
			text: {
				base: "text-zinc-100",
				muted: "text-zinc-500",
				subtle: "text-zinc-300",
				dark: "text-black",
				light: "text-white",
				inverse: "text-black",
				success: "text-lime-400",
				warning: "text-yellow-400",
				error: "text-rose-500",
				info: "text-cyan-400",
				accent: "text-fuchsia-400",
			},
			border: {
				base: "border-zinc-100",
				muted: "border-zinc-800",
				subtle: "border-zinc-700",
				success: "border-lime-400",
				warning: "border-yellow-400",
				error: "border-rose-500",
				info: "border-cyan-400",
				accent: "border-fuchsia-400",
			},
		},
	},
};

const simulationThemeDark = {
	colors: {
		bg: {
			main: "bg-zinc-950",
			loading: "bg-black",
			overlay: "bg-black/70",
			modal: "bg-zinc-900",
			nav: "bg-zinc-900",
			statusBadge: "bg-zinc-800/70",
			buttonPrimary: "bg-emerald-500",
			buttonHover: "hover:bg-zinc-800",
			navBtnHover: "hover:bg-zinc-800",
			header: "bg-zinc-900",
			headerHover: "hover:bg-zinc-950",
		},
		text: {
			main: "text-zinc-100",
			primary: "text-white",
			secondary: "text-zinc-400",
			accent: "text-emerald-400",
			title: "text-white",
			inverse: "text-white",
			navBtnHover: "hover:text-white",
		},
		border: {
			main: "border-zinc-700",
			accent: "border-emerald-400/50",
			button: "border-zinc-600",
		},
		shadow: {
			button: "shadow-[6px_6px_0px_#000]",
			buttonActive: "shadow-[2px_2px_0px_#000]",
			buttonHover: "shadow-[2px_2px_0px_#000]",
		},
		status: {
			online: "bg-emerald-500",
		},
		selection: "selection:bg-emerald-500/30",
		dither: {
			waveColor: [0.16, 0.8, 0.5] as [number, number, number],
		},
		panels: {
			bg: {
				base: "bg-zinc-950",
				surface: "bg-zinc-900",
				surfaceAlt: "bg-zinc-800",
				surfaceHover: "hover:bg-zinc-800",
				surfaceHoverAlt: "hover:bg-zinc-700",
				success: "bg-lime-400/80",
				warning: "bg-yellow-400/80",
				error: "bg-rose-500/80",
				info: "bg-cyan-400/80",
				accent: "bg-fuchsia-400/80",
			},
			text: {
				base: "text-zinc-100",
				muted: "text-zinc-500",
				subtle: "text-zinc-400",
				dark: "text-black",
				light: "text-white",
				inverse: "text-white",
				success: "text-lime-400",
				warning: "text-yellow-400",
				error: "text-rose-400",
				info: "text-cyan-400",
				accent: "text-fuchsia-400",
			},
			border: {
				base: "border-zinc-800",
				muted: "border-zinc-900",
				subtle: "border-zinc-700",
				success: "border-lime-500/40",
				warning: "border-yellow-500/40",
				error: "border-rose-500/40",
				info: "border-cyan-500/40",
				accent: "border-fuchsia-500/40",
			},
		},
	},
};

const getInitialTheme = () => {
	if (typeof window !== "undefined") {
		const storedTheme = localStorage.getItem("simulationTheme");
		if (storedTheme === "dark") return simulationThemeDark;
		if (storedTheme === "high") return simulationThemeHigh;
	}
	return simulationThemeHigh;
};

export const simulationTheme = { ...getInitialTheme() };

let themeChangeListeners: (() => void)[] = [];

export const onThemeChange = (listener: () => void) => {
	themeChangeListeners.push(listener);
	return () => {
		themeChangeListeners = themeChangeListeners.filter(
			(l) => l !== listener,
		);
	};
};

export const setSimulationTheme = (isDark: boolean) => {
	const newTheme = isDark ? simulationThemeDark : simulationThemeHigh;
	Object.assign(simulationTheme, newTheme);
	if (typeof window !== "undefined") {
		localStorage.setItem("simulationTheme", isDark ? "dark" : "high");
	}
	themeChangeListeners.forEach((listener) => listener());
};
