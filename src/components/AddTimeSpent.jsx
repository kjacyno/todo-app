import { useState } from "react";
import PropTypes from "prop-types";
import { updateDataAPI } from "../helpers/api.js";
import {Button, TextField} from "@mui/material";

function AddTimeSpent({ operationId, timeSpent, setTasks, setTimeSpentId }) {
    const [value, setValue] = useState(timeSpent);

    async function handleUpdateOperation() {
        if (value > 0) {
            await updateDataAPI(
                { timeSpent: value + timeSpent },
                "operations",
                operationId,
                "PATCH"
            );
            setTasks((prev) =>
                prev.map((task) => ({
                    ...task,
                    operations: task.operations.map((operation) => {
                        // if (operation.id !== operationId) return operation;
                        // operation.timeSpent += value
                        // return operation
                        if (operation.id === operationId) {
                            operation.timeSpent += value;
                        }
                        return operation;
                    }),
                }))
            );
            setTimeSpentId(null);
        }
    }

    return (
        <>
            {value < 0 && <b>value should be higher then 0</b>}
            <TextField
                className='add-time'
                id="outlined-basic"
                label="Add time spent"
                variant="outlined"
                type="number"
                value={value}
                onChange={(e) => setValue(+e.target.value)}
                min="0"
            />
            <Button variant="outlined" onClick={handleUpdateOperation}>
                Add
            </Button>
            <Button variant="outlined" onClick={() => setTimeSpentId(null)}>
                Cancel
            </Button>
        </>
    );
}

AddTimeSpent.propTypes = {
    operationId: PropTypes.number,
    timeSpent: PropTypes.any,
    setTasks: PropTypes.func,
    setTimeSpentId: PropTypes.func,
};

export default AddTimeSpent;
