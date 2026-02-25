import { useState } from "react";

export default function Counter() {
	const [x, setx] = useState(0);
	const subtraction = () => {
		setx(x - 1);
	};

	const incriment = () => {
		setx(x + 1);
	};

	return (
		<>
			<h1>{x}</h1>
			<button onClick={subtraction}>-</button>
			<button onClick={incriment}>+</button>
		</>
	);
}
