import { useState, useMemo, useEffect } from "react";

function TaskManager() {
	const [tasks, setTasks] = useState(() => {
		const d = JSON.parse(localStorage.getItem("tasks"));
		return Array.isArray(d) ? d : [];
	});
	const [newTaskText, setNewTaskText] = useState("");
	const [newTaskDeadline, setNewTaskDeadline] = useState("");
	const [newTaskType, setNewTaskType] = useState("домашняя");
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");
	const [editDeadline, setEditDeadline] = useState("");
	const [editType, setEditType] = useState("домашняя");
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

	const addTask = (text, deadline = "", type = "домашняя") => {
		const trimmed = text.trim();
		if (!trimmed) return;
		setTasks([
			...tasks,
			{
				id: Math.round(Math.random() * 10000000),
				text: trimmed,
				done: false,
				deadline,
				type,
			},
		]);
		setNewTaskText("");
		setNewTaskDeadline("");
		setNewTaskType("домашняя");
	};

	const removeTask = (id) => {
		setTasks(tasks.filter((t) => t.id !== id));
	};

	const editTask = (id, newText, newDeadline, newType) => {
		const trimmed = newText.trim();
		if (!trimmed) return;
		setTasks(
			tasks.map((task) =>
				task.id === id
					? {
							...task,
							text: trimmed,
							deadline: newDeadline,
							type: newType,
						}
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
						width: "220px",
					}}
				/>
				<input
					type="datetime-local"
					value={newTaskDeadline}
					onChange={(e) => setNewTaskDeadline(e.target.value)}
					style={{ ...inputStyle, marginRight: "10px" }}
				/>
				<select
					value={newTaskType}
					onChange={(e) => setNewTaskType(e.target.value)}
					style={{ ...inputStyle, marginRight: "10px" }}
				>
					<option value="домашняя">Домашняя</option>
					<option value="рабочая">Рабочая</option>
				</select>
				<button
					onClick={() =>
						addTask(newTaskText, newTaskDeadline, newTaskType)
					}
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
							<div style={{ flexGrow: 1, width: "100%" }}>
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
								<select
									value={editType}
									onChange={(e) =>
										setEditType(e.target.value)
									}
									style={{
										padding: "6px",
										width: "30%",
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
								>
									<option value="домашняя">Домашняя</option>
									<option value="рабочая">Рабочая</option>
								</select>
								<div style={{ marginTop: 10 }}>
									<button
										onClick={() =>
											editTask(
												t.id,
												editText,
												editDeadline,
												editType,
											)
										}
										style={buttonStyle}
									>
										Сохранить
									</button>
									<button
										onClick={() => setEditingId(null)}
										style={buttonStyle}
									>
										Отмена
									</button>
								</div>
							</div>
						) : (
							<>
								<div style={{ flexGrow: 1, minWidth: 0 }}>
									<label
										style={{
											textDecoration: t.done
												? "line-through"
												: "none",
											cursor: "pointer",
										}}
									>
										<input
											type="checkbox"
											checked={t.done}
											onChange={() => toggleDone(t.id)}
											style={{ marginRight: "10px" }}
										/>
										{t.text}{" "}
										{t.deadline && (
											<span
												style={{
													fontWeight: "normal",
													fontSize: "12px",
													color: "#555",
													marginLeft: "10px",
												}}
											>
												(до{" "}
												{new Date(
													t.deadline,
												).toLocaleString()}
												)
											</span>
										)}
										<span
											style={{
												fontStyle: "italic",
												fontSize: "12px",
												marginLeft: "10px",
												padding: "2px 6px",
												backgroundColor:
													t.type === "домашняя"
														? "#b2d8b2"
														: "#add8e6",
												borderRadius: "4px",
												userSelect: "none",
											}}
										>
											{t.type}
										</span>
									</label>
								</div>
								<div>
									<button
										onClick={() => {
											setEditingId(t.id);
											setEditText(t.text);
											setEditDeadline(t.deadline || "");
											setEditType(t.type);
										}}
										style={buttonStyle}
									>
										Редактировать
									</button>
									<button
										onClick={() => removeTask(t.id)}
										style={buttonStyle}
									>
										Удалить
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
