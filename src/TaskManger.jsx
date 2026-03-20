import { useState, useMemo, useEffect } from "react";

function TaskManager() {
	const [tasks, setTasks] = useState(() => {
		const d = JSON.parse(localStorage.getItem("tasks"));
		return typeof d == "object" && d ? d : [];
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

	return (
		<div
			style={{
				backgroundColor: theme === "light" ? "#e2dfdf" : "#303030",
				color: theme === "light" ? "#000000" : "#fff",
				minHeight: '100vh',
				minWidth: '100vh',
				margin: 0,
				padding: 0,
		
			}}
		>
			<button onClick={toggleTheme}>
				{theme === "light" ? "Тёмная тема" : "Светлая тема"}
			</button>

			<div>
				<input
					type="text"
					value={newTaskText}
					onChange={(e) => setNewTaskText(e.target.value)}
					placeholder="Введите задачу"
				/>
				<input
					type="datetime-local"
					value={newTaskDeadline}
					onChange={(e) => setNewTaskDeadline(e.target.value)}
				/>
				<button onClick={() => addTask(newTaskText, newTaskDeadline)}>
					добавить
				</button>
			</div>

			<div style={{ marginTop: "10px" }}>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Поиск задач"
				/>
			</div>

			<ul>
				{sortedTasks.map((t) => (
					<li
						key={t.id}
						style={{
							backgroundColor: isOverdue(t.deadline, t.done)
								? "#835858"
								: "transparent",
							padding: "0px",
							margin: "5px 0",
						}}
					>
						{editingId === t.id ? (
							<div>
								<input
									type="text"
									value={editText}
									onChange={(e) =>
										setEditText(e.target.value)
									}
								/>
								<input
									type="datetime-local"
									value={editDeadline}
									onChange={(e) =>
										setEditDeadline(e.target.value)
									}
								/>
								<button
									onClick={() =>
										editTask(t.id, editText, editDeadline)
									}
								>
									Сохранить
								</button>
								<button onClick={() => setEditingId(null)}>
									Отмена
								</button>
							</div>
						) : (
							<>
								<span
									style={{
										textDecoration: t.done
											? "line-through"
											: "none",
									}}
								>
									{t.text}
								</span>
								<input
									type="checkbox"
									checked={t.done}
									onChange={() => toggleDone(t.id)}
								/>
								{t.deadline && (
									<span
										style={{
											marginLeft: "10px",
											fontSize: "12px",
										}}
									>
										{new Date(t.deadline).toLocaleString()}
										{isOverdue(t.deadline, t.done) &&
											" (просрочено)"}
									</span>
								)}
								<button onClick={() => removeTask(t.id)}>
									удалить
								</button>
								<button
									onClick={() => {
										setEditingId(t.id);
										setEditText(t.text);
										setEditDeadline(t.deadline || "");
									}}
								>
									редактировать
								</button>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default TaskManager;
