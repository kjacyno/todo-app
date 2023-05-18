import { useState } from "react";
import { sendDataAPI } from "../helpers/api.js";
import PropTypes from "prop-types";
import { Button, TextField } from "@mui/material";


function AddOperation({ taskId, setOperationId, setTasks }) {
    const [value, setValue] = useState("");

    async function handleAddOperation() {
        if (value.trim() !== "") {
            const data = await sendDataAPI(
                {
                    description: value,
                    timeSpent: 0,
                    addedDate: new Date(),
                    taskId,
                },
                "operations"
            );

            setTasks((prev) =>
                prev.map((task) => {
                    if (task.id !== taskId) return task;
                    // const operations = task.operations ?? [] TO ALBO DODANIE KEY OPERATIONS DO TASKA
                    task.operations = [...task.operations, data];

                    return task;
                })
            );
            setOperationId(null);
        }
    }

    return (
        <div className='add-operation'>
            <TextField
                id="standard-basic"
                label="Operation description"
                variant="standard"
                type="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            <Button variant="outlined" onClick={handleAddOperation}>
                Confirm
            </Button>
            <Button variant="outlined" onClick={() => setOperationId(null)}>
                Cancel
            </Button>
        </div>
    );
}

AddOperation.propTypes = {
    taskId: PropTypes.number,
    setOperationId: PropTypes.func,
    setTasks: PropTypes.func,
};

export default AddOperation;
