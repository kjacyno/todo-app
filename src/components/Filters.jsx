import * as PropType from "prop-types";

function Filters({setFilter, filter}) {
    return (
        <div>
            <button className={filter === 'all' ? 'current-filter' : ''}
                    onClick={() => setFilter('all')}>All
            </button>
            <button className={filter === 'open' ? 'current-filter' : ''}
                    onClick={() => setFilter('open')}>Active
            </button>
            <button className={filter === 'closed' ? 'current-filter' : ''}
                    onClick={() => setFilter('closed')}>Completed
            </button>
        </div>
    );
}
Filters.propTypes = {
    setFilter: PropType.func,
    filter: PropType.any
}
export default Filters;