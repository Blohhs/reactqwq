import { useState, useMemo, useEffect } from "react";

function TaskManager() {
	const [tasks, setTasks] = useState(() => {
		const d = JSON.parse(localStorage.getItem("tasks"));
		return typeof d === "object" && d ? d : [];
	});
	const [newTaskText, setNewTaskText] = useState("");
	const [newTaskDeadline, setNewTaskDeadline] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");
	const [editDeadline, setEditDeadline] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	const filteredTasks = useMemo(() => {
		if (!searchTerm.trim()) return tasks;
		return tasks.filter((task) =>
			task.text.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [tasks, searchTerm]);

	const sortedTasks = useMemo(() => {
		return [...filteredTasks].sort((a, b) => a.text.localeCompare(b.text));
	}, [filteredTasks]);

	const addTask = (text, deadline = "") => {
		const trimmed = text.trim();
		if (!trimmed) return;
		setTasks([
			...tasks,
			{
				id: Math.round(Math.random() * 10000000),
				text: trimmed,
				done: false,
				deadline,
			},
		]);
		setNewTaskText("");
		setNewTaskDeadline("");
	};

	const removeTask = (id) => {
		setTasks(tasks.filter((t) => t.id !== id));
	};

	const editTask = (id, newText, newDeadline) => {
		const trimmed = newText.trim();
		if (!trimmed) return;
		setTasks(
			tasks.map((task) =>
				task.id === id
					? { ...task, text: trimmed, deadline: newDeadline }
					: task,
			),
		);
		setEditingId(null);
	};

	const toggleDone = (id) => {
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, done: !task.done } : task,
			),
		);
	};

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	const isOverdue = (deadline, done) => {
		if (!deadline || done) return false;
		return new Date(deadline) < new Date();
	};

	const buttonStyle = {
		backgroundColor: theme === "light" ? "#7c7c7c" : "#1f1f1f",
		color: theme === "light" ? "#fff" : "#ddd",
		border: "none",
		padding: "8px 12px",
		margin: "0 5px",
		cursor: "pointer",
		borderRadius: "4px",
	};

	const inputStyle = {
		padding: "8px",
		borderRadius: "4px",
		border: theme === "light" ? "1px solid #ccc" : "1px solid #999",
		backgroundColor: theme === "light" ? "#fff" : "#444",
		color: theme === "light" ? "#000" : "#eee",
	};

	return (
		<div
			style={{
				backgroundColor: theme === "light" ? "#e2dfdf" : "#303030",
				color: theme === "light" ? "#000000" : "#fff",
				minHeight: "100vh",
				minWidth: "100vh",
				margin: 0,
				padding: 20,
				fontFamily: "Arial, sans-serif",
			}}
		>
			<button onClick={toggleTheme} style={buttonStyle}>
				{theme === "light" ? "Тёмная тема" : "Светлая тема"}
			</button>

			<div style={{ marginTop: 20 }}>
				<input
					type="text"
					value={newTaskText}
					onChange={(e) => setNewTaskText(e.target.value)}
					placeholder="Введите задачу"
					style={{
						...inputStyle,
						marginRight: "10px",
						width: "250px",
					}}
				/>
				<input
					type="datetime-local"
					value={newTaskDeadline}
					onChange={(e) => setNewTaskDeadline(e.target.value)}
					style={{ ...inputStyle, marginRight: "10px" }}
				/>
				<button
					onClick={() => addTask(newTaskText, newTaskDeadline)}
					style={buttonStyle}
				>
					добавить
				</button>
			</div>

			<div style={{ marginTop: "10px" }}>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Поиск задач"
					style={{ ...inputStyle, width: "300px" }}
				/>
			</div>

			<ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
				{sortedTasks.map((t) => (
					<li
						key={t.id}
						style={{
							backgroundColor: isOverdue(t.deadline, t.done)
								? "#835858"
								: "transparent",
							padding: "15px",
							margin: "8px 0",
							borderRadius: "6px",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexWrap: "wrap",
						}}
					>
						{editingId === t.id ? (
							<div style={{ flexGrow: 1 }}>
								<input
									type="text"
									value={editText}
									onChange={(e) =>
										setEditText(e.target.value)
									}
									style={{
										padding: "6px",
										width: "40%",
										marginRight: "10px",
										borderRadius: "4px",
										border:
											theme === "light"
												? "1px solid #ccc"
												: "1px solid #999",
										backgroundColor:
											theme === "light" ? "#fff" : "#444",
										color:
											theme === "light" ? "#000" : "#eee",
									}}
								/>
								<input
									type="datetime-local"
									value={editDeadline}
									onChange={(e) =>
										setEditDeadline(e.target.value)
									}
									style={{
										padding: "6px",
										width: "25%",
										marginRight: "10px",
										borderRadius: "4px",
										border:
											theme === "light"
												? "1px solid #ccc"
												: "1px solid #999",
										backgroundColor:
											theme === "light" ? "#fff" : "#444",
										color:
											theme === "light" ? "#000" : "#eee",
									}}
								/>
								<button
									onClick={() =>
										editTask(t.id, editText, editDeadline)
									}
									style={buttonStyle}
								>
									Сохранить
								</button>
								<button
									onClick={() => setEditingId(null)}
									style={{
										...buttonStyle,
										backgroundColor:
											theme === "light" ? "#888" : "#888",
										marginLeft: "5px",
									}}
								>
									Отмена
								</button>
							</div>
						) : (
							<>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										flexGrow: 1,
									}}
								>
									<input
										type="checkbox"
										checked={t.done}
										onChange={() => toggleDone(t.id)}
										style={{ marginRight: "10px" }}
									/>
									<span
										style={{
											textDecoration: t.done
												? "line-through"
												: "none",
											wordBreak: "break-word",
										}}
									>
										{t.text}
									</span>
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "10px",
										flexWrap: "wrap",
									}}
								>
									{t.deadline && (
										<span style={{ fontSize: "12px" }}>
											{new Date(
												t.deadline,
											).toLocaleString()}{" "}
											{isOverdue(t.deadline, t.done) &&
												" (просрочено)"}
										</span>
									)}
									<button
										onClick={() => removeTask(t.id)}
										style={buttonStyle}
									>
										удалить
									</button>
									<button
										onClick={() => {
											setEditingId(t.id);
											setEditText(t.text);
											setEditDeadline(t.deadline || "");
										}}
										style={buttonStyle}
									>
										редактировать
									</button>
								</div>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default TaskManager;
