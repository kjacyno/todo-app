import {Box, Button, TextField} from "@mui/material";
import {sendDataAPI} from "../helpers/api.js";
import PropTypes from "prop-types";

function TaskInput({title, setTitle, description, setDescription, tasks, setTasks}) {
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
    return (
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
        </form>    );
}
TaskInput.propTypes = {
    tasks: PropTypes.array,
    setTasks: PropTypes.func,
    title: PropTypes.any,
    setTitle: PropTypes.func,
    description: PropTypes.any,
    setDescription: PropTypes.func,
};
export default TaskInput;