import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { gsap } from "gsap";

export interface TargetCursorProps {
	/** * CSS selector for elements that trigger the cursor.
	 * Defaults to: ".cursor-target, .cursor-target-up, .cursor-target-down, .cursor-target-left, .cursor-target-right"
	 */
	targetSelector?: string;
	spinDuration?: number;
	hideDefaultCursor?: boolean;
	hoverDuration?: number;
}

const CONSTANTS = { borderWidth: 3, cornerSize: 12 };

const TargetCursor: React.FC<TargetCursorProps> = ({
	targetSelector = ".cursor-target, .cursor-target-up, .cursor-target-down, .cursor-target-left, .cursor-target-right",
	spinDuration = 3,
	hideDefaultCursor = true,
	hoverDuration = 0.3,
}) => {
	const cursorRef = useRef<HTMLDivElement>(null);
	const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
	const spinTl = useRef<gsap.core.Timeline | null>(null);
	const dotRef = useRef<HTMLDivElement>(null);

	const activeStrengthRef = useRef({ val: 0 });
	const xTo = useRef<gsap.QuickToFunc | null>(null);
	const yTo = useRef<gsap.QuickToFunc | null>(null);

	const isMobile = useMemo(() => {
		if (typeof window === "undefined") return false;
		const hasTouchScreen =
			"ontouchstart" in window || navigator.maxTouchPoints > 0;
		const isSmallScreen = window.innerWidth <= 768;
		const userAgent =
			navigator.userAgent || navigator.vendor || (window as any).opera;
		const mobileRegex =
			/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
		const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
		return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
	}, []);

	const moveCursor = useCallback((x: number, y: number) => {
		if (!cursorRef.current) return;
		xTo.current?.(x);
		yTo.current?.(y);
	}, []);

	useEffect(() => {
		if (isMobile || !cursorRef.current) return;

		const originalCursor = document.body.style.cursor;
		if (hideDefaultCursor) {
			document.body.style.cursor = "none";
		}

		const cursor = cursorRef.current;
		cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(
			".target-cursor-corner",
		);

		// Initialize position
		gsap.set(cursor, {
			xPercent: -50,
			yPercent: -50,
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		});

		xTo.current = gsap.quickTo(cursor, "x", {
			duration: 0.1,
			ease: "power3.out",
		});
		yTo.current = gsap.quickTo(cursor, "y", {
			duration: 0.1,
			ease: "power3.out",
		});

		// Spin Timeline
		if (spinTl.current) spinTl.current.kill();
		spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, {
			rotation: "+=360",
			duration: spinDuration,
			ease: "none",
		});

		let activeTarget: Element | null = null;
		let currentLeaveHandler: (() => void) | null = null;
		let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

		const cleanupTarget = (target: Element) => {
			if (currentLeaveHandler) {
				target.removeEventListener("mouseleave", currentLeaveHandler);
			}
			currentLeaveHandler = null;
		};

		const tickerFn = () => {
			if (!activeTarget || !cursorRef.current || !cornersRef.current)
				return;

			const strength = activeStrengthRef.current.val;
			if (strength === 0) return;

			const rect = activeTarget.getBoundingClientRect();
			const { borderWidth, cornerSize } = CONSTANTS;

			const targetPositions = [
				{ x: rect.left - borderWidth, y: rect.top - borderWidth },
				{
					x: rect.right + borderWidth - cornerSize,
					y: rect.top - borderWidth,
				},
				{
					x: rect.right + borderWidth - cornerSize,
					y: rect.bottom + borderWidth - cornerSize,
				},
				{
					x: rect.left - borderWidth,
					y: rect.bottom + borderWidth - cornerSize,
				},
			];

			const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
			const cursorY = gsap.getProperty(cursorRef.current, "y") as number;
			const corners = Array.from(cornersRef.current);

			corners.forEach((corner, i) => {
				const currentX = gsap.getProperty(corner, "x") as number;
				const currentY = gsap.getProperty(corner, "y") as number;
				const targetX = targetPositions[i].x - cursorX;
				const targetY = targetPositions[i].y - cursorY;

				const finalX = currentX + (targetX - currentX) * strength;
				const finalY = currentY + (targetY - currentY) * strength;

				gsap.set(corner, { x: finalX, y: finalY });
			});
		};

		const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
		window.addEventListener("mousemove", moveHandler);

		const scrollHandler = () => {
			if (!activeTarget || !cursorRef.current) return;
			const mouseX = gsap.getProperty(cursorRef.current, "x") as number;
			const mouseY = gsap.getProperty(cursorRef.current, "y") as number;
			const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);

			const isStillOverTarget =
				elementUnderMouse &&
				(elementUnderMouse === activeTarget ||
					elementUnderMouse.closest(targetSelector) === activeTarget);

			if (!isStillOverTarget) {
				currentLeaveHandler?.();
			}
		};
		window.addEventListener("scroll", scrollHandler, { passive: true });

		// Mouse Down/Up (Click effects)
		const mouseDownHandler = () => {
			if (!dotRef.current) return;
			// Only scale down if we aren't currently an arrow (which is scaled up)
			const isArrow =
				(gsap.getProperty(dotRef.current, "scale") as number) > 2;

			const targetScale = isArrow ? 2.5 : 0.7;

			gsap.to(dotRef.current, { scale: targetScale, duration: 0.3 });
			gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
		};

		const mouseUpHandler = () => {
			if (!dotRef.current) return;
			const isArrow =
				(gsap.getProperty(dotRef.current, "scale") as number) > 2;

			const targetScale = isArrow ? 3 : 1;

			gsap.to(dotRef.current, { scale: targetScale, duration: 0.3 });
			gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
		};

		window.addEventListener("mousedown", mouseDownHandler);
		window.addEventListener("mouseup", mouseUpHandler);

		const enterHandler = (e: MouseEvent) => {
			const directTarget = e.target as Element;
			const target = directTarget.closest(targetSelector);

			if (!target || !cursorRef.current || !cornersRef.current) return;
			if (activeTarget === target) return;

			if (activeTarget) cleanupTarget(activeTarget);
			if (resumeTimeout) {
				clearTimeout(resumeTimeout);
				resumeTimeout = null;
			}

			activeTarget = target;
			const corners = Array.from(cornersRef.current);

			corners.forEach((corner) => gsap.killTweensOf(corner));
			gsap.killTweensOf(cursorRef.current, "rotation");
			spinTl.current?.pause();
			gsap.set(cursorRef.current, { rotation: 0 });

			// --- Directional Dot Logic ---
			const isUp = target.classList.contains("cursor-target-up");
			const isDown = target.classList.contains("cursor-target-down");
			const isLeft = target.classList.contains("cursor-target-left");
			const isRight = target.classList.contains("cursor-target-right");
			const isDirectional = isUp || isDown || isLeft || isRight;

			if (isDirectional && dotRef.current) {
				let rotation = 0;
				if (isRight) rotation = 90;
				if (isDown) rotation = 180;
				if (isLeft) rotation = 270;

				gsap.to(dotRef.current, {
					scale: 3, // Scale up to be visible as an arrow
					rotation: rotation,
					// Morph to triangle
					clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
					borderRadius: "0%",
					duration: 0.3,
					ease: "back.out(1.7)",
				});
			} else if (dotRef.current) {
				// Standard hover (remain a dot)
				gsap.to(dotRef.current, {
					scale: 1,
					rotation: 0,
					clipPath: "none", // Reset clip path
					borderRadius: "50%",
					duration: 0.3,
				});
			}

			// --- Corner Snap Logic ---
			const rect = target.getBoundingClientRect();
			const { borderWidth, cornerSize } = CONSTANTS;
			const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
			const cursorY = gsap.getProperty(cursorRef.current, "y") as number;

			const initialTargetPositions = [
				{ x: rect.left - borderWidth, y: rect.top - borderWidth },
				{
					x: rect.right + borderWidth - cornerSize,
					y: rect.top - borderWidth,
				},
				{
					x: rect.right + borderWidth - cornerSize,
					y: rect.bottom + borderWidth - cornerSize,
				},
				{
					x: rect.left - borderWidth,
					y: rect.bottom + borderWidth - cornerSize,
				},
			];

			gsap.ticker.add(tickerFn, false, false);

			gsap.to(activeStrengthRef.current, {
				val: 1,
				duration: hoverDuration,
				ease: "power2.out",
			});

			corners.forEach((corner, i) => {
				gsap.to(corner, {
					x: initialTargetPositions[i].x - cursorX,
					y: initialTargetPositions[i].y - cursorY,
					duration: 0.2,
					ease: "power2.out",
				});
			});

			const leaveHandler = () => {
				gsap.ticker.remove(tickerFn);
				gsap.set(activeStrengthRef.current, {
					val: 0,
					overwrite: true,
				});

				activeTarget = null;

				// Reset Dot
				if (dotRef.current) {
					gsap.to(dotRef.current, {
						scale: 1,
						rotation: 0,
						clipPath: "none",
						borderRadius: "50%",
						duration: 0.3,
						ease: "power2.out",
					});
				}

				if (cornersRef.current) {
					const corners = Array.from(cornersRef.current);
					gsap.killTweensOf(corners);
					const { cornerSize } = CONSTANTS;
					const positions = [
						{ x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
						{ x: cornerSize * 0.5, y: -cornerSize * 1.5 },
						{ x: cornerSize * 0.5, y: cornerSize * 0.5 },
						{ x: -cornerSize * 1.5, y: cornerSize * 0.5 },
					];

					corners.forEach((corner, index) => {
						gsap.to(corner, {
							x: positions[index].x,
							y: positions[index].y,
							duration: 0.3,
							ease: "power3.out",
						});
					});
				}

				resumeTimeout = setTimeout(() => {
					if (!activeTarget && cursorRef.current && spinTl.current) {
						const currentRotation = gsap.getProperty(
							cursorRef.current,
							"rotation",
						) as number;
						const normalizedRotation = currentRotation % 360;

						spinTl.current.kill();
						spinTl.current = gsap
							.timeline({ repeat: -1 })
							.to(cursorRef.current, {
								rotation: "+=360",
								duration: spinDuration,
								ease: "none",
							});

						gsap.to(cursorRef.current, {
							rotation: normalizedRotation + 360,
							duration:
								spinDuration * (1 - normalizedRotation / 360),
							ease: "none",
							onComplete: () => {
								spinTl.current?.restart();
							},
						});
					}
					resumeTimeout = null;
				}, 50);

				cleanupTarget(target);
			};

			currentLeaveHandler = leaveHandler;
			target.addEventListener("mouseleave", leaveHandler);
		};

		window.addEventListener("mouseover", enterHandler as EventListener);

		return () => {
			gsap.ticker.remove(tickerFn);
			window.removeEventListener("mousemove", moveHandler);
			window.removeEventListener(
				"mouseover",
				enterHandler as EventListener,
			);
			window.removeEventListener("scroll", scrollHandler);
			window.removeEventListener("mousedown", mouseDownHandler);
			window.removeEventListener("mouseup", mouseUpHandler);
			if (activeTarget) {
				cleanupTarget(activeTarget);
			}
			spinTl.current?.kill();
			document.body.style.cursor = originalCursor;
			activeStrengthRef.current.val = 0;
		};
	}, [
		targetSelector,
		spinDuration,
		moveCursor,
		hideDefaultCursor,
		isMobile,
		hoverDuration,
	]);

	if (isMobile) return null;

	return (
		<div
			ref={cursorRef}
			className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999]"
			style={{ willChange: "transform" }}
		>
			{/* Removed rounded-full from className to allow GSAP to animate borderRadius */}
			<div
				ref={dotRef}
				className="absolute top-1/2 left-1/2 w-1 h-1 bg-white -translate-x-1/2 -translate-y-1/2 rounded-full"
				style={{ willChange: "transform, clip-path" }}
			/>
			<div
				className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0"
				style={{ willChange: "transform" }}
			/>
			<div
				className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white translate-x-1/2 -translate-y-[150%] border-l-0 border-b-0"
				style={{ willChange: "transform" }}
			/>
			<div
				className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white translate-x-1/2 translate-y-1/2 border-l-0 border-t-0"
				style={{ willChange: "transform" }}
			/>
			<div
				className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white -translate-x-[150%] translate-y-1/2 border-r-0 border-t-0"
				style={{ willChange: "transform" }}
			/>
		</div>
	);
};

export default TargetCursor;
