import {useState} from "react";
import PropTypes from "prop-types";
import {updateDataAPI} from "../helpers/api.js";

function AddTimeSpent({operationId, timeSpent, setTasks, setTimeSpentId}) {
    const [value, setValue] = useState(0)

    async function handleUpdateOperation() {
        if (value > 0) {
            await updateDataAPI(
                {'timeSpent': value + timeSpent},
                'operations',
                operationId,
                'PATCH'
            )
            setTasks((prev) => prev.map((task) => ({
                ...task,
                operations: task.operations.map((operation) => {
                    // if (operation.id !== operationId) return operation;
                    // operation.timeSpent += value
                    // return operation
                    if (operation.id === operationId) {
                        operation.timeSpent += value
                    }
                    return operation
                })

            })))
            setTimeSpentId(null)
        }
    }

    return (
        <>
            {value < 0 && <b>value should be higher then 0</b>}
            <input
                type='number'
                value={value}
                onChange={(e) => setValue(+e.target.value)}
                min='0'
                />
            <button onClick={handleUpdateOperation}>Add</button>
            <button onClick={() => setTimeSpentId(null)}>Cancel</button>
            </>
            );
            }

AddTimeSpent.propTypes = {
    operationId: PropTypes.number,
    timeSpent: PropTypes.number,
    setTasks: PropTypes.func,
    setTimeSpentId: PropTypes.func
}

export default AddTimeSpent;