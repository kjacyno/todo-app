import PropTypes from "prop-types";

function Counter({tasks}) {
    return (
        <div>{tasks.filter((task) => task.status === 'open').length} to do left</div>

    );
}
Counter.propTypes = {
    tasks: PropTypes.array
}
export default Counter;