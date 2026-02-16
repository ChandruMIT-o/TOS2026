import React, { useRef, useEffect, useMemo, useCallback } from "react";

interface LetterGlitchProps {
	glitchColors?: string[];
	glitchSpeed?: number;
	centerVignette?: boolean;
	outerVignette?: boolean;
	smooth?: boolean;
	characters?: string;
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

const hexToRgbArray = (hex: string): [number, number, number] => {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16),
			]
		: [0, 0, 0];
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
	const context = useRef<CanvasRenderingContext2D | null>(null);
	const animationRef = useRef<number | null>(null);
	const lastGlitchTime = useRef(0);

	// OPTIMIZATION 1: Flattened Data Structures (SoA - Structure of Arrays)
	// Instead of an array of objects, we use TypedArrays for performance.
	const gridRef = useRef({ columns: 0, rows: 0, total: 0 });
	const charIndexRef = useRef<Uint8Array | null>(null); // Stores index of character in string
	const colorRef = useRef<Float32Array | null>(null); // Stores current R, G, B
	const targetColorRef = useRef<Float32Array | null>(null); // Stores target R, G, B
	const colorProgressRef = useRef<Float32Array | null>(null); // Stores progress 0.0 - 1.0

	// Pre-parse colors into a numeric array for faster access
	const glitchColorsRgb = useMemo(
		() => glitchColors.map(hexToRgbArray),
		[glitchColors],
	);

	// Pre-calculate char count for modulo operations
	const charCount = characters.length;

	const fontSize = 16;
	const charWidth = 10;
	const charHeight = 20;

	const initializeLetters = useCallback(
		(columns: number, rows: number) => {
			const total = columns * rows;
			gridRef.current = { columns, rows, total };

			// Allocating TypedArrays (Much faster than new Array(N).fill({}))
			charIndexRef.current = new Uint8Array(total);
			colorRef.current = new Float32Array(total * 3);
			targetColorRef.current = new Float32Array(total * 3);
			colorProgressRef.current = new Float32Array(total);

			for (let i = 0; i < total; i++) {
				charIndexRef.current[i] = Math.floor(Math.random() * charCount);

				const color =
					glitchColorsRgb[
						Math.floor(Math.random() * glitchColorsRgb.length)
					];

				// Set initial colors
				colorRef.current[i * 3] = color[0];
				colorRef.current[i * 3 + 1] = color[1];
				colorRef.current[i * 3 + 2] = color[2];

				targetColorRef.current[i * 3] = color[0];
				targetColorRef.current[i * 3 + 1] = color[1];
				targetColorRef.current[i * 3 + 2] = color[2];

				colorProgressRef.current[i] = 1;
			}
		},
		[charCount, glitchColorsRgb],
	);

	const drawLetters = useCallback(() => {
		const ctx = context.current;
		if (
			!ctx ||
			!charIndexRef.current ||
			!colorRef.current ||
			!targetColorRef.current ||
			!colorProgressRef.current
		)
			return;

		const { columns, total } = gridRef.current;
		const colors = colorRef.current;
		const targets = targetColorRef.current;
		const progress = colorProgressRef.current;
		const charIndices = charIndexRef.current;

		// OPTIMIZATION 2: Dirty Clearing
		// If smooth is OFF, we don't clear the whole canvas, we only overwrite specific letters.
		// If smooth is ON, clearing the whole canvas is usually faster than tracking thousands of dirty rects.
		if (smooth) {
			ctx.clearRect(
				0,
				0,
				canvasRef.current!.width,
				canvasRef.current!.height,
			);
		}

		ctx.font = `${fontSize}px monospace`;
		ctx.textBaseline = "top";

		for (let i = 0; i < total; i++) {
			// OPTIMIZATION 3: Skip drawing if static and not clearing screen
			// If !smooth, we only need to draw if progress < 1 (meaning it was just updated)
			if (!smooth && progress[i] >= 1) continue;

			const x = (i % columns) * charWidth;
			const y = ((i / columns) | 0) * charHeight; // Bitwise OR 0 is faster than Math.floor

			if (smooth && progress[i] < 1) {
				progress[i] += 0.05;
				if (progress[i] > 1) progress[i] = 1;

				const t = progress[i];
				const index3 = i * 3;

				// Lerp R, G, B
				colors[index3] =
					colors[index3] + (targets[index3] - colors[index3]) * t;
				colors[index3 + 1] =
					colors[index3 + 1] +
					(targets[index3 + 1] - colors[index3 + 1]) * t;
				colors[index3 + 2] =
					colors[index3 + 2] +
					(targets[index3 + 2] - colors[index3 + 2]) * t;
			}

			// OPTIMIZATION 4: Integer Math for colors
			// Browser engines optimize `| 0` heavily.
			const index3 = i * 3;
			ctx.fillStyle = `rgb(${colors[index3] | 0}, ${colors[index3 + 1] | 0}, ${colors[index3 + 2] | 0})`;

			// If !smooth, we need to clear the rect before drawing the new character
			if (!smooth) {
				ctx.clearRect(x, y, charWidth, charHeight);
			}

			ctx.fillText(characters[charIndices[i]], x, y);
		}
	}, [smooth, characters, charWidth, charHeight, fontSize]);

	const updateLetters = useCallback(() => {
		if (
			!gridRef.current.total ||
			!charIndexRef.current ||
			!targetColorRef.current ||
			!colorRef.current ||
			!colorProgressRef.current
		)
			return;

		const updateCount = Math.max(
			1,
			Math.floor(gridRef.current.total * 0.05),
		);

		const charIndices = charIndexRef.current;
		const targets = targetColorRef.current;
		const colors = colorRef.current;
		const progress = colorProgressRef.current;

		for (let i = 0; i < updateCount; i++) {
			const index = Math.floor(Math.random() * gridRef.current.total);

			// Random Char
			charIndices[index] = Math.floor(Math.random() * charCount);

			// Random Target Color
			const targetColor =
				glitchColorsRgb[
					Math.floor(Math.random() * glitchColorsRgb.length)
				];
			const index3 = index * 3;

			targets[index3] = targetColor[0];
			targets[index3 + 1] = targetColor[1];
			targets[index3 + 2] = targetColor[2];

			if (!smooth) {
				colors[index3] = targetColor[0];
				colors[index3 + 1] = targetColor[1];
				colors[index3 + 2] = targetColor[2];
				progress[index] = 0.5; // Set to <1 to trigger redraw in dirty rect logic
			} else {
				progress[index] = 0;
			}
		}
	}, [charCount, glitchColorsRgb, smooth]);

	const animate = useCallback(() => {
		const now = Date.now();
		// If smooth is off, we only draw when the glitch timer hits
		// If smooth is on, we draw every frame for interpolation
		if (smooth) {
			if (now - lastGlitchTime.current >= glitchSpeed) {
				updateLetters();
				lastGlitchTime.current = now;
			}
			drawLetters();
		} else {
			if (now - lastGlitchTime.current >= glitchSpeed) {
				updateLetters();
				drawLetters();
				lastGlitchTime.current = now;
			}
		}

		animationRef.current = requestAnimationFrame(animate);
	}, [glitchSpeed, smooth, updateLetters, drawLetters]);

	const resizeCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || !canvas.parentElement) return;

		const parent = canvas.parentElement;
		const rect = parent.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;

		// Only resize if dimensions actually changed to avoid heavy reallocation
		if (
			canvas.width !== rect.width * dpr ||
			canvas.height !== rect.height * dpr
		) {
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;

			if (context.current) {
				context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
			}

			const columns = Math.ceil(rect.width / charWidth);
			const rows = Math.ceil(rect.height / charHeight);

			initializeLetters(columns, rows);
		}
	}, [initializeLetters]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		context.current = canvas.getContext("2d", { alpha: true }); // Alpha true for transparent background
		resizeCanvas();
		animationRef.current = requestAnimationFrame(animate);

		const handleResize = () => resizeCanvas();
		window.addEventListener("resize", handleResize);

		return () => {
			if (animationRef.current)
				cancelAnimationFrame(animationRef.current);
			window.removeEventListener("resize", handleResize);
		};
	}, [resizeCanvas, animate]);

	// Reset grid if config changes
	useEffect(() => {
		if (gridRef.current.columns) {
			initializeLetters(gridRef.current.columns, gridRef.current.rows);
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
