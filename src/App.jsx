import './App.css'
import {useEffect, useState} from "react";
import {deleteDataAPI, getDataAPI, sendDataAPI} from "./helpers/api.js";
import AddOperation from "./components/AddOperation.jsx";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [operationId, setOperationId] = useState(null)

    useEffect(() => {
        const data = Promise.all([getDataAPI('tasks'), getDataAPI('operations')])
        data.then((results) => {
            const [taskData, operationData] = results;
            const tasks = taskData.map((task) => ({
                ...task,
                operations: operationData.filter((operation) => operation.taskId === task.id)
            }))
            setTasks(tasks);
        })
            .catch(console.error)
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        const result = await sendDataAPI(
            {
                title,
                description,
                status: 'open',
                addedDate: new Date(),
                operations: []
            }, 'tasks'
        );
        setTasks([...tasks, result])
        setTitle('');
        setDescription('')

    }

    async function handleDeleteTask(event) {
        const id = +event.target.dataset.id
        await deleteDataAPI(id,'tasks');
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
    async function handleDeleteOp(event) {
        const id = +event.target.dataset.id;
        if (!isNaN(id)) {
            const updatedTasks = tasks.map((task) => {
                if (task.operations.some((op) => op.id === id)) {
                    return {
                        ...task,
                        operations: task.operations.filter((op) => op.id !== id),
                    };
                }
                return task;
            });
            await deleteDataAPI(id, 'operations');
            setTasks(updatedTasks);
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>Title</label>
                    <input
                        value={title}
                        type='text'
                        id='title'
                        name='title'
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='desc'>Description</label>
                    <textarea
                        value={description}
                        id='desc'
                        name='desc'
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <button type='submit'>Add task</button>
            </form>
            <br/>
            <section>
                {tasks.map((task) => (
                    <div key={task.id}>
                        <b>{task.title}</b> - <span>{task.description}</span>
                        {operationId === task.id ?
                            (<AddOperation
                                setOperationId={setOperationId}
                                taskId={task.id}
                                setTasks={setTasks}
                            />) :
                            (<button onClick={() => setOperationId(task.id)}>
                                Add operation
                            </button>)}

                        <button>Finish</button>
                        <button onClick={handleDeleteTask} data-id={task.id}>Delete</button>
                        {task.operations?.length > 0 ? (task.operations.map((operation) => (
                            <div key={operation.id}>
                                <span>{operation.description}</span> ----------- Time spent:
                                <span> {operation.timeSpent}</span>
                                <button onClick={handleDeleteOp} data-id={operation.id}><i className="fa-solid fa-trash"></i></button>
                            </div>
                        ))) : ''}
                    </div>
                ))}
            </section>


        </>
    )
}

export default App
