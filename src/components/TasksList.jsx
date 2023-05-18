import { List } from "@mui/material";
import { deleteDataAPI, updateDataAPI } from "../helpers/api.js";
import Task from "./Task.jsx";
import PropTypes from "prop-types";

function TasksList({
    tasks,
    setTasks,
    filter,
    setOperationId,
    operationId,
    timeSpentId,
    setTimeSpentId,
}) {
    async function handleDelete(event) {
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

    function handleChangeStatus(id) {
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
        <List>
            {tasks
                .filter((task) =>
                    filter === "all" ? true : task.status === filter
                )
                .map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        handleDeleteOp={handleDeleteOp}
                        handleChangeStatus={handleChangeStatus}
                        handleDelete={handleDelete}
                        setOperationId={setOperationId}
                        operationId={operationId}
                        timeSpentId={timeSpentId}
                        setTimeSpentId={setTimeSpentId}
                        setTasks={setTasks}
                    />
                ))}
        </List>
    );
}

TasksList.propTypes = {
    tasks: PropTypes.array,
    setTasks: PropTypes.func,
    filter: PropTypes.any,
    setOperationId: PropTypes.func,
    operationId: PropTypes.any,
    timeSpentId: PropTypes.any,
    setTimeSpentId: PropTypes.func,
};
export default TasksList;
