import React, { useState } from "react";

export default function TaskManager() {
  const [task, setTask] = useState([]); 
  const [taskInput, setTaskInput] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (taskInput === "") return;
    setTask([...task, taskInput]);
    setTaskInput("");
  };

  const clearAllTasks = () => {
    setTask([]);
  };

  return (
    <>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button type="submit">add</button>
      </form>
      <ul>
        {task.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>

      <button onClick={clearAllTasks}>убери</button>
    </>
  );
}