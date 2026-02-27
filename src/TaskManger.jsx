import { useState } from "react";

function TaskManager() {
	const [tasks, setTasks] = useState([]);
	const [newTaskText, setNewTaskText] = useState("");

	const addTask = (text, deadline = "") => {
		setTasks([
			...tasks,
			{
				id: Math.round(Math.random() * 10000000),
				text,
				done: false,
				deadline,
			},
		]);
	};

	const removeTask = (id) => {
		setTasks(tasks.filter((t) => t.id !== id));
	};

	const editTask = (id, newText) => {
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, text: newText } : task,
			),
		);
	};

	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");

	return (
		<>
			<input
				type="text"
				value={newTaskText}
				onChange={(e) => setNewTaskText(e.target.value)}
				placeholder="Введите задачу"
			/>
			<button onClick={() => addTask(newTaskText)}>добавить</button>

			<ul>
				{tasks.map((t) => (
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
									readOnly
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
