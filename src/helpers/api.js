export async function getAllTasks() {
    const response = await fetch('http://localhost:8081/tasks');
    return response.json()
}