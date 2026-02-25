import { useState } from "react";

export default function TextImput() {
	const [text, setText] = useState("");

	const clearText = () => setText("");

	return (
		<div>
			<input
				onChange={(event) => setText(event.target.value)}
				type="text"
				value={text}
			/>
			<h1>{text}</h1>
			<button onClick={clearText}>убери</button>
		</div>
	);
}
