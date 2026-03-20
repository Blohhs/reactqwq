import { useState, useMemo, useEffect } from "react";

function TaskManager() {
	const [tasks, setTasks] = useState(() => {
		const d = JSON.parse(localStorage.getItem("tasks"));
		return typeof d == "object" && d ? d : [];
	});
	const [newTaskText, setNewTaskText] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

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
	};

	const removeTask = (id) => {
		setTasks(tasks.filter((t) => t.id !== id));
	};

	const editTask = (id, newText) => {
		const trimmed = newText.trim();
		if (!trimmed) return;
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, text: trimmed } : task,
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

	return (
		<>
			<div>
				<input
					type="text"
					value={newTaskText}
					onChange={(e) => setNewTaskText(e.target.value)}
					placeholder="Введите задачу"
				/>
				<button onClick={() => addTask(newTaskText)}>добавить</button>
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
					<li key={t.id}>
						{editingId === t.id ? (
							<div>
								<input
									type="text"
									value={editText}
									onChange={(e) =>
										setEditText(e.target.value)
									}
								/>
								<button
									onClick={() => {
										editTask(t.id, editText);
										setEditingId(null);
									}}
								>
									Сохранить
								</button>
								<button onClick={() => setEditingId(null)}>
									Отмена
								</button>
							</div>
						) : (
							<>
								<span>{t.text}</span>
								<input
									type="checkbox"
									checked={t.done}
									onChange={() => toggleDone(t.id)}
								/>
								{t.deadline && (
									<div>
										{new Date(t.deadline).toLocaleString()}
									</div>
								)}
								<button onClick={() => removeTask(t.id)}>
									удалить
								</button>
								<button
									onClick={() => {
										setEditingId(t.id);
										setEditText(t.text);
									}}
								>
									редактировать
								</button>
							</>
						)}
					</li>
				))}
			</ul>
		</>
	);
}

export default TaskManager;
