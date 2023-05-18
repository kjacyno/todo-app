import * as PropType from "prop-types";

function ClearTasks({handleDeleteCompleted}) {
    return (
        (<button onClick={handleDeleteCompleted}>
            Clear completed</button>)
    );
}

ClearTasks.propTypes = {
 handleDeleteCompleted: PropType.func
}
export default ClearTasks;