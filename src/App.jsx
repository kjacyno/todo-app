import "./App.css";
import { useEffect, useState } from "react";
import {
    deleteDataAPI,
    getDataAPI,
    sendDataAPI,
    updateDataAPI,
} from "./helpers/api.js";
import AddOperation from "./components/AddOperation.jsx";
import AddTimeSpent from "./components/AddTimeSpent.jsx";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [operationId, setOperationId] = useState(null);
    const [timeSpentId, setTimeSpentId] = useState(null);

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

    async function handleSubmit(event) {
        event.preventDefault();
        if (title.trim() !== "") {
            const result = await sendDataAPI(
                {
                    title,
                    description,
                    status: "open",
                    addedDate: new Date(),
                    operations: [],
                },
                "tasks"
            );
            setTasks([...tasks, result]);
            setTitle("");
            setDescription("");
        }
    }

    async function handleDeleteTask(event) {
        const id = +event.target.dataset.id;
        const task = tasks.find((task) => task.id === id);

        for (const operation of task.operations) {
            await deleteDataAPI(operation.id, "operations");
        }

        await deleteDataAPI(id, "tasks");
        setTasks(tasks.filter((task) => task.id !== id));
    }

    // async function handleDeleteOp(event) {
    //     const id = +event.target.dataset.id;
    //         await deleteDataAPI(id, 'operations');
    //         setTasks(prevTasks => {
    //             const newTasks = [...prevTasks];
    //             for (const task of newTasks) {
    //                 if (task.operations) {
    //                     task.operations = task.operations.filter(op => op.id !== id);
    //                 }
    //             }
    //             return newTasks;
    //         });
    // }
    async function handleDeleteOp(id) {
        //trzeba było przekazać id w deklaracji funkcji w button zeby nie miało
        //znaczenia co klikamy dokładnie (ikonka czy tekst) zeby zawsze sie dobrze przekazywało id
        //i zeby zniknał błąd NaN, który trafiał czasem na ikonkę jako event.target
        await deleteDataAPI(id, "operations");
        setTasks(
            tasks.map((task) => {
                return {
                    ...task,
                    operations: task.operations.filter(
                        (operation) => operation.id !== id
                    ),
                };
            })
        );
        // if (!isNaN(id)) {
        //     const updatedTasks = tasks.map((task) => {
        //         if (task.operations.some((op) => op.id === id)) {
        //             return {
        //                 ...task,
        //                 operations: task.operations.filter((op) => op.id !== id),
        //             };
        //         }
        //         return task;
        //     });
        //     setTasks(updatedTasks);
    }

    function handleFinishTask(id) {
        return async function () {
            await updateDataAPI(
                {
                    status: "closed",
                },
                "tasks",
                id,
                "PATCH"
            );
            setTasks(
                tasks.map((task) => ({
                    ...task,
                    status: task.id === id ? "closed" : task.status,
                }))
            );
        };
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        value={title}
                        type="text"
                        id="title"
                        name="title"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="desc">Description</label>
                    <textarea
                        value={description}
                        id="desc"
                        name="desc"
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <button type="submit">Add task</button>
            </form>
            <br />
            <section>
                {tasks.map((task) => (
                    <div key={task.id}>
                        <b>{task.title}</b> - <span>{task.description}</span>
                        {operationId === task.id ? (
                            <AddOperation
                                setOperationId={setOperationId}
                                taskId={task.id}
                                setTasks={setTasks}
                            />
                        ) : (
                            <>
                                {task.status === "open" && (
                                    <button
                                        onClick={() => setOperationId(task.id)}
                                    >
                                        Add operation
                                    </button>
                                )}
                            </>
                        )}
                        {task.status === "open" && (
                            <button onClick={handleFinishTask(task.id)}>
                                Finish
                            </button>
                        )}
                        <button onClick={handleDeleteTask} data-id={task.id}>
                            Delete
                        </button>
                        {task.operations &&
                            task.operations.map((operation) => (
                                <div key={operation.id}>
                                    <span>{operation.description}</span>{" "}
                                    ----------- Time spent:
                                    {operation.timeSpent > 0 && (
                                        <b>
                                            {~~(operation.timeSpent / 60)}h{" "}
                                            {operation.timeSpent % 60}m
                                        </b>
                                    )}
                                    {operation.id === timeSpentId ? (
                                        <AddTimeSpent
                                            setTasks={setTasks}
                                            operationId={operation.id}
                                            timeSpent={operation.timeSpent}
                                            setTimeSpentId={setTimeSpentId}
                                        />
                                    ) : (
                                        <>
                                            {task.status === "open" && (
                                                <button
                                                    onClick={() =>
                                                        setTimeSpentId(
                                                            operation.id
                                                        )
                                                    }
                                                >
                                                    Add time
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {task.status === "open" && (
                                        <button
                                            onClick={() =>
                                                handleDeleteOp(operation.id)
                                            }
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>
                ))}
            </section>
        </>
    );
}

export default App;
