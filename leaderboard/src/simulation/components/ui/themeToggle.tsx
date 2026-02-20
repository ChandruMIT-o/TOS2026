import { Sun, Moon } from "lucide-react";

export default function ThemeSwitch({
	checked,
	onChange,
}: {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
}) {
	return (
		<label className="relative inline-block cursor-pointer">
			<input
				type="checkbox"
				className="peer sr-only"
				checked={checked}
				onChange={(e) => onChange?.(e.target.checked)}
			/>

			{/* Track */}
			<div
				className="
                    w-14 h-8 rounded-full transition-all duration-300
                    bg-[length:205%] bg-left 
                    bg-[linear-gradient(to_right,#f5f5f5_50%,#2a2a2a_50%)] 
                    peer-checked:bg-right
                "
			/>

			{/* Thumb */}
			<div
				className="
                    absolute top-1 left-1 flex items-center justify-center 
                    w-6 h-6 rounded-full transition-all duration-300
                    bg-[length:205%] bg-right 
                    bg-[linear-gradient(to_right,#ffffff_50%,#1f1f1f_50%)] 
                    peer-checked:translate-x-6 peer-checked:bg-left 
                    peer-checked:[&_.sun]:scale-0 peer-checked:[&_.moon]:scale-100
                "
			>
				{/* Icons */}
				<Sun
					size={14}
					className="sun text-yellow-500 transition-all duration-300"
				/>
				<Moon
					size={14}
					className="moon absolute text-white scale-0 transition-all duration-300"
				/>
			</div>
		</label>
	);
}
