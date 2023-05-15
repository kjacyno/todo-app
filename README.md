# Todo App
This is a Todo App built using React, JavaScript, and Vite. It allows you to add tasks to your to-do list, perform operations on each task, set the time spent on these operations, delete and edit tasks, and sort them using filters.

## Features
Add tasks to your to-do list.
Perform operations on each task.
Set the time spent on each operation.
Delete and edit tasks.
Sort tasks using filters (All, Active, Completed).

##Technologies Used

React: A JavaScript library for building user interfaces.
JavaScript: A programming language used for client-side scripting.
Vite: A build tool that provides a fast and optimized development environment for web applications.
Firebase: A platform that offers various services for building and managing web and mobile applications.

visit https://todo-d1651.web.app/


# Notes

## Pobieranie danych - podczas montowania komponentu

1. Trzeba mieć dostęp do API (np json-server)
2. Stworzyć funkcję pobierającą dane (fetch/axios)
3. Stworzyć stan, do którego zapiszemy dany
4. Należy wywołać funkcję w momencie kiedy komponent jest dodany do HTML(componentDidMount, useEffect)

```javascript
//Ad.2
// funkcja do pobierania danych z określonego adresu URL, async zawsze zwraca Promise,
//więc musimy go obsłużyć jak promise czyli then/catch bądź await w async function
//funkcja zwraca response.json bez zapisywania do zmiennych, zebysmy mogli ją exportowac i uzywac w róznych modułach
async function getDataAPI() {
    const response = await fetch("http://localhost:8081/tasks");
    return response.json();
}

//Ad.3
// aby stworzyć stan komponentu funkcyjnego należy użyć useState lub useReducer,
//oba trzeba importować.
//useState przyjmuje initial state, czyli wartość początkową,
// jeżeli to input to pusty string, jeżeli wiele danych to pusta tablica
//useState zwraca tablicę 2-elementową, więc ją destrukturyzujemy,
//pierwszy element to zmienna reprezentująca stan.
//drugi to funkcja, która modyfikuje zmienną reprezentującą stan

import { useState } from "react";
const [task, setTask] = useState([]);

//Ad.4
//aby wykonać funkcję podczas montowania komponentu, można użyć useEffect z drugim parametrem, który musi być
//tablicą, natomiast jeżeli to ma się wykonać raz to tablica musi być pusta
//-brak drugiego parametru lub falsy value -> wykonuje sie przy każdym rerenderze komponentu
//-pusta tablica -> wykonuje się po dodaniu komponentu do html
//-tablica z zależnościami(zmiennymi) -> wykonuje się na początku i przy każdej zmianie wartości z tablicy
//wewnątrz callback do useEffect mamy wywołanie funkcji która pobiera dane, w związku z tym, że jest async
//asynchroniczna (Promise based) to obsługujemy ją przez then i catch.
import { useEffect } from "react";
useEffect(() => {
    getDataAPI()
        .then((data) => setTask(data))
        .cattch(console.error);
}, []);
```

## Dodawanie danych do aplikacji przez użytkownika

1. UI, user interface, najlepiej używać znacznik form (wysyłanie enterm i wygodniejsze użytkowanie)

```jsx
<form>
    <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
    </div>
    <div>
        <label htmlFor="desc">Description</label>
        <textarea id="desc" name="desc" />
    </div>
</form>
```

2. Obsługa formularzy/inputów może być zrobiona na 3 podstawowe sposoby:

    - controlled inputs(potrzebny stan i funkcja, która po wyemitowaniu zdarzenia go aktualizuje)
    - uncotrolled inputs(obsługujemy dane, dopiero jak użytkownik chce je wysłać)
    - biblioteki -> Formik + Yup do walidacji

3. Wysłać dane na server, po odpowiedzi servera aktualizujemy stan

```javascript
/// wysyłanie danych na form onSubmit w wersji async await oraz promise fetch/catch

async function handleSubmit(event) {
    event.preventDefault();
    const result = await sendDataAPI({
        title,
        description,
        status: "open",
        addedDate: new Date(),
    });

    setTitle("");
    setDescription("");
    setTask([...task, result]);
}

function handleSubmitPromise(event) {
    event.preventDefault();
    const response = sendDataAPI({
        title,
        description,
        status: "open",
        addedDate: new Date(),
    });

    response.then((result) => {
        setTitle("");
        setDescription("");
        setTask([...task, result]);
    });
}
```

## Wyświetlanie danych w JSX

```jsx
//tablica -> const tasks = [{a:1, b:2, c3}, {a:23, b:14, c:43}]
{
    tasks.map((task) => <p key={task.a}>{task.b}</p>);
}
// do wyświetlania danych - prawdopodobnie ze state(useState,this.state) używa sie map (metoda tablicy),
//która pryjume funkcje dla każdego elementu tablicy ją wykonuje, to co zwróci będzie elemenetem, który
//się wyświetli, więc zazwyczaj zwraca JSX
//należy pamiętać o props key, bo react używa go do wyliczenia różnicy, którą musi zaaplikować pomiędzy virtual dom i real dom
//ket musi być unikalne i nie zmienialne, ale może być dowolnym prostym typem danych.
```

## Pobieranie i scalanie danych z różnych endpointów

```javascript
useEffect(() => {
    //metoda statyczna[nie trzeba pisać obiektu, np new Promise] Promise.all() przyjmuje tablicę Promises,
    // następnie obsługuje je jednocześnie, czekając aż ostatni się skończy.
    // metoda all zwraca Promise, więc trzeba ją obsłużyć odpowiednio: await lub then.
    const data = Promise.all([getDataAPI("tasks"), getDataAPI("operations")]);
    //w useEffect nie da się używać async await

    data.then((results) => {
        //ta funkcja wykonuje się, kiedy wszsytkie promisy zostały skończone, result posiada w sobię tablicę,
        //w której są wyniki wszystkich promise z promise all, w tej samej kolejności jak zostały dodane
        //dlatego poniżej można użtć array destructuring:
        const [taskData, operationData] = results;

        //aby połączyć 2 tablice z danymi można przemapować jedną z nich, dodając elementy drugiej do elementów pierwszej
        const tasks = taskData.map((task) => ({
            //dla każdego elementu tablicy taskData tworzę nowy obiekt, gdzie za pomocą spread operator wstawiam wszystkie elementy
            ...task,
            //dokładam do nowego obiektu key operations - a jego wartość wylicza filter wyników z drugiej tablicy
            operations: operationData.filter(
                (operation) => operation.taskId === task.id
            ),
        }));
        //aktualizuje stan tasks
        setTasks(tasks);
    }).catch(console.error);
}, []);
```
