import React, { useRef, useEffect, useMemo, useCallback } from "react";

interface LetterGlitchProps {
	glitchColors?: string[];
	glitchSpeed?: number;
	centerVignette?: boolean;
	outerVignette?: boolean;
	smooth?: boolean;
	characters?: string;
}

interface RGB {
	r: number;
	g: number;
	b: number;
}

interface LetterState {
	char: string;
	color: RGB;
	targetColor: RGB;
	colorProgress: number;
}

const containerStyle: React.CSSProperties = {
	position: "relative",
	width: "100%",
	height: "100%",
	backgroundColor: "transparent",
	overflow: "hidden",
};

const canvasStyle: React.CSSProperties = {
	display: "block",
	width: "100%",
	height: "100%",
};

const outerVignetteStyle: React.CSSProperties = {
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	pointerEvents: "none",
	background:
		"radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
};

const centerVignetteStyle: React.CSSProperties = {
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	pointerEvents: "none",
	background:
		"radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
};

const hexToRgb = (hex: string): RGB => {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: { r: 0, g: 0, b: 0 };
};

const LetterGlitch: React.FC<LetterGlitchProps> = ({
	glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
	glitchSpeed = 50,
	centerVignette = false,
	outerVignette = true,
	smooth = true,
	characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationRef = useRef<number | null>(null);
	const context = useRef<CanvasRenderingContext2D | null>(null);
	const letters = useRef<LetterState[]>([]);
	const grid = useRef({ columns: 0, rows: 0 });
	const lastGlitchTime = useRef(0);

	const rgbColors = useMemo(() => glitchColors.map(hexToRgb), [glitchColors]);

	const fontSize = 16;
	const charWidth = 10;
	const charHeight = 20;

	// Stable random pickers
	const getRandomChar = useCallback(() => {
		return characters[Math.floor(Math.random() * characters.length)];
	}, [characters]);

	const getRandomColor = useCallback(() => {
		return rgbColors[Math.floor(Math.random() * rgbColors.length)];
	}, [rgbColors]);

	const calculateGrid = (width: number, height: number) => {
		const columns = Math.ceil(width / charWidth);
		const rows = Math.ceil(height / charHeight);
		return { columns, rows };
	};

	// 1. Decoupled initialization logic
	// This now runs whenever dimensions OR characters/colors change
	const initializeLetters = useCallback(
		(columns: number, rows: number) => {
			grid.current = { columns, rows };
			const totalLetters = columns * rows;

			letters.current = new Array(totalLetters);

			for (let i = 0; i < totalLetters; i++) {
				const color = getRandomColor();
				letters.current[i] = {
					char: getRandomChar(),
					color: { ...color },
					targetColor: { ...color },
					colorProgress: 1,
				};
			}
		},
		[getRandomChar, getRandomColor],
	);

	// Optimization: Use refs for dimensions to avoid layout thrashing
	const canvasSize = useRef({ width: 0, height: 0 });

	const drawLetters = useCallback(() => {
		if (!context.current || letters.current.length === 0) return;
		const ctx = context.current;
		const { width, height } = canvasSize.current;

		// Optimization: Clear using cached dimensions
		ctx.clearRect(0, 0, width, height);
		ctx.font = `${fontSize}px monospace`;
		ctx.textBaseline = "top";

		const cols = grid.current.columns;
		const lettersArr = letters.current;
		const len = lettersArr.length;

		for (let i = 0; i < len; i++) {
			const letter = lettersArr[i];

			// Optimization: Integrate smooth color transitions into the draw loop
			if (smooth && letter.colorProgress < 1) {
				letter.colorProgress += 0.05;
				if (letter.colorProgress > 1) letter.colorProgress = 1;

				const t = letter.colorProgress;
				const start = letter.color;
				const end = letter.targetColor;

				letter.color.r = start.r + (end.r - start.r) * t;
				letter.color.g = start.g + (end.g - start.g) * t;
				letter.color.b = start.b + (end.b - start.b) * t;
			}

			const x = (i % cols) * charWidth;
			// Optimization: Avoid repeated Math.floor
			const y = ((i / cols) | 0) * charHeight;
			ctx.fillStyle = `rgb(${Math.floor(letter.color.r)}, ${Math.floor(letter.color.g)}, ${Math.floor(letter.color.b)})`;
			ctx.fillText(letter.char, x, y);
		}
	}, [smooth, fontSize, charWidth, charHeight]);

	const updateLetters = useCallback(() => {
		if (!letters.current.length) return;

		const updateCount = Math.max(
			1,
			Math.floor(letters.current.length * 0.05),
		);

		for (let i = 0; i < updateCount; i++) {
			const index = Math.floor(Math.random() * letters.current.length);
			const letter = letters.current[index];
			if (!letter) continue;

			letter.char = getRandomChar();
			letter.targetColor = getRandomColor();

			if (!smooth) {
				letter.color = { ...letter.targetColor };
				letter.colorProgress = 1;
			} else {
				letter.colorProgress = 0;
			}
		}
	}, [getRandomChar, getRandomColor, smooth]);

	const animate = useCallback(() => {
		const now = Date.now();
		let needsRedraw = false;

		// 1. Glitch Update
		if (now - lastGlitchTime.current >= glitchSpeed) {
			updateLetters();
			needsRedraw = true;
			lastGlitchTime.current = now;
		}

		// 2. Smooth Transition & Draw
		// If smooth is on, we always redraw because colors might be transitioning
		if (smooth || needsRedraw) {
			drawLetters();
		}

		animationRef.current = requestAnimationFrame(animate);
	}, [glitchSpeed, smooth, updateLetters, drawLetters]);

	const resizeCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || !canvas.parentElement) return;

		const parent = canvas.parentElement;
		const dpr = window.devicePixelRatio || 1;
		const rect = parent.getBoundingClientRect();

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;

		// Optimization: Store caching dimensions
		canvasSize.current = { width: canvas.width, height: canvas.height };

		if (context.current) {
			context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		const { columns, rows } = calculateGrid(rect.width, rect.height);

		// Initialize Grid with new Dimensions
		initializeLetters(columns, rows);
		drawLetters();
	}, [initializeLetters, drawLetters]);

	// 2. Setup Canvas & Resize Listener
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		context.current = canvas.getContext("2d");
		resizeCanvas();
		animationRef.current = requestAnimationFrame(animate);

		let resizeTimeout: number;

		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = window.setTimeout(() => {
				resizeCanvas();
			}, 100);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			if (animationRef.current)
				cancelAnimationFrame(animationRef.current);
			window.removeEventListener("resize", handleResize);
			clearTimeout(resizeTimeout);
		};
	}, [resizeCanvas, animate]);

	// 3. New Effect: Explicitly handle Prop Changes (Data Reset)
	// This fixes the "slow update" issue by forcing a reset when props change
	useEffect(() => {
		if (grid.current.columns > 0 && grid.current.rows > 0) {
			initializeLetters(grid.current.columns, grid.current.rows);
		}
	}, [characters, glitchColors, initializeLetters]);

	return (
		<div style={containerStyle}>
			<canvas ref={canvasRef} style={canvasStyle} />
			{outerVignette && <div style={outerVignetteStyle} />}
			{centerVignette && <div style={centerVignetteStyle} />}
		</div>
	);
};

export default LetterGlitch;
