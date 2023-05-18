import { Button, ListItem, ListItemText } from "@mui/material";
import AddOperation from "./AddOperation.jsx";
import AddTimeSpent from "./AddTimeSpent.jsx";
import PropTypes from "prop-types";

function Task({
    task,
    setTasks,
    handleChangeStatus,
    handleDelete,
    setTimeSpentId,
    timeSpentId,
    operationId,
    setOperationId,
    handleDeleteOp,
}) {
    return (
        <ListItem className="task">
            <div className="task-main">
                <ListItemText
                    className="listItemText"
                    primary={task.title}
                    secondary={task.description}
                />
                <span
                    className={
                        task.status === "open" ? "status active" : "status"
                    }
                ></span>
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
                                onClick={() => setOperationId(task.id)}
                            >
                                Add operation
                            </Button>
                        )}

                        {task.status === "open" && (
                            <Button
                                variant="text"
                                onClick={handleChangeStatus(task.id)}
                            >
                                Finish
                            </Button>
                        )}
                        <Button
                            variant="text"
                            onClick={handleDelete}
                            data-id={task.id}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
            {task.operations &&
                task.operations.map((operation) => (
                    <div className="operation" key={operation.id}>
                        <div className="operation-description">
                            {operation.description}
                        </div>{" "}
                        <div className="time-spent">
                            Time spent:
                            {operation.timeSpent > 0 ? (
                                <b>
                                    {~~(operation.timeSpent / 60)}h{" "}
                                    {operation.timeSpent % 60}m
                                </b>
                            ) : <b>0m </b>}
                        </div>
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
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            setTimeSpentId(operation.id)
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
                                onClick={() => handleDeleteOp(operation.id)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </Button>
                        )}
                    </div>
                ))}
        </ListItem>
    );
}

Task.propTypes = {
    task: PropTypes.any,
    tasks: PropTypes.array,
    setTasks: PropTypes.func,
    filter: PropTypes.any,
    setOperationId: PropTypes.func,
    operationId: PropTypes.any,
    timeSpentId: PropTypes.any,
    setTimeSpentId: PropTypes.func,
    handleChangeStatus: PropTypes.func,
    handleDelete: PropTypes.func,
    handleDeleteOp: PropTypes.func,
};

export default Task;
