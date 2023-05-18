import "./App.css";
import { useEffect, useState } from "react";
import { getDataAPI } from "./helpers/api.js";

import { Container, CssBaseline } from "@mui/material";
import Header from "./components/Header.jsx";
import TaskInput from "./components/TaskInput.jsx";
import TasksList from "./components/TasksList.jsx";
import Filters from "./components/Filters.jsx";
import Counter from "./components/Counter.jsx";
import ClearTasks from "./components/ClearTasks.jsx";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [operationId, setOperationId] = useState(null);
    const [timeSpentId, setTimeSpentId] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const data = Promise.all([
            getDataAPI("tasks"),
            getDataAPI("operations"),
        ]);
        data.then((results) => {
            const [taskData, operationData] = results;
            const tasks = taskData.map((task) => ({
                ...task,
                operations: operationData.filter(
                    (operation) => operation.taskId === task.id
                ),
            }));
            setTasks(tasks);
        }).catch(console.error);
    }, []);

    function handleDeleteCompleted() {
        setTasks(tasks.filter((task) => { return task.status === 'open'}));
    }

    return (
        <>
            <CssBaseline />
            <Container fixed>
                <Header />
                <TaskInput
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    tasks={tasks}
                    setTasks={setTasks}
                />
                <br />
                <section className="tasks-section">
                    <TasksList
                        tasks={tasks}
                        setTasks={setTasks}
                        filter={filter}
                        setOperationId={setOperationId}
                        operationId={operationId}
                        timeSpentId={timeSpentId}
                        setTimeSpentId={setTimeSpentId}
                    />
                </section>
                <Counter tasks={tasks} />
                <Filters filter={filter} setFilter={setFilter} />
                {tasks.some((task) => task.status) && (
                    <ClearTasks handleDeleteCompleted={handleDeleteCompleted} />
                )}
            </Container>
        </>
    );
}

export default App;
