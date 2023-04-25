export async function getAllTasks() {
    const response = await fetch('http://localhost:8081/tasks');
    return response.json()
}

export async function sendTaskData (data){
    const response = await fetch('http://localhost:8081/tasks',
        {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
    return response.json();
}

