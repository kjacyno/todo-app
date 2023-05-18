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
import {
    Button,
    Container,
    CssBaseline,
    TextField,
    Box,
    List,
    ListItem, ListItemText
} from "@mui/material";

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
            <CssBaseline />
            <Container fixed>
                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            id="standard-basic"
                            label="Title"
                            variant="standard"
                            value={title}
                            type="text"
                            name="title"
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <TextField
                            id="standard-basic"
                            label="Description"
                            variant="standard"
                            value={description}
                            name="desc"
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </Box>
                    <Button variant="outlined" type="submit">
                        Add task
                    </Button>
                </form>
                <br />
                <section className="tasks-section">
                    <List>
                        {tasks.map((task) => (
                                                            <ListItem className="task" key={task.id}>
                                    <div className='task-main'>
                                    <ListItemText className='listItemText'
                                        primary={task.title}
                                        secondary={task.description}
                                    />
                                {operationId === task.id ? (
                                    <AddOperation
                                        setOperationId={setOperationId}
                                        taskId={task.id}
                                        setTasks={setTasks}
                                    />
                                ) : (
                                    <>
                                        {task.status === "open" && (
                                            <Button
                                                variant="text"
                                                onClick={() =>
                                                    setOperationId(task.id)
                                                }
                                            >
                                                Add operation
                                            </Button>
                                        )}

                                {task.status === "open" && (
                                    <Button
                                        variant="text"
                                        onClick={handleFinishTask(task.id)}
                                    >
                                        Finish
                                    </Button>
                                )}
                                <Button
                                    variant="text"
                                    onClick={handleDeleteTask}
                                    data-id={task.id}
                                >
                                    Delete
                                </Button>
                                    </>
                                )}
                                    </div>
                                {task.operations &&
                                    task.operations.map((operation) => (
                                        <div className='operation' key={operation.id}>
                                            <div className='operation-description'>{operation.description}</div>{" "}
                                            <div className='time-spent'>Time spent:
                                            {operation.timeSpent > 0 && (
                                                <b>
                                                    {
                                                        ~~(
                                                            operation.timeSpent /
                                                            60
                                                        )
                                                    }
                                                    h {operation.timeSpent % 60}
                                                    m
                                                </b>
                                            )}</div>
                                            {operation.id === timeSpentId ? (
                                                <AddTimeSpent
                                                    setTasks={setTasks}
                                                    operationId={operation.id}
                                                    timeSpent={
                                                        operation.timeSpent
                                                    }
                                                    setTimeSpentId={
                                                        setTimeSpentId
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    {task.status === "open" && (
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() =>
                                                                setTimeSpentId(
                                                                    operation.id
                                                                )
                                                            }
                                                        >
                                                            Add time
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                            {task.status === "open" && (
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handleDeleteOp(
                                                            operation.id
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </ListItem>
                        ))}
                    </List>
                </section>
            </Container>
        </>
    );
}

export default App;
