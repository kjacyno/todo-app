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

async function getAllTasks() {
    const response = await fetch('http://localhost:8081/tasks');
    return response.json()
}

//Ad.3
// aby stworzyć stan komponentu funkcyjnego należy użyć useState lub useReducer,
//oba trzeba importować.
//useState przyjmuje initial state, czyli wartość początkową, 
// jeżeli to input to pusty string, jeżeli wiele danych to pusta tablica
//useState zwraca tablicę 2-elementową, więc ją destrukturyzujemy,
//pierwszy element to zmienna reprezentująca stan.
//drugi to funkcja, która modyfikuje zmienną reprezentującą stan

import {useState} from 'react';
const [task, setTask] = useState([])

//Ad.4
//aby wykonać funkcję podczas montowania komponentu, można użyć useEffect z drugim parametrem, który musi być
//tablicą, natomiast jeżeli to ma się wykonać raz to tablica musi być pusta
//-brak drugiego parametru lub falsy value -> wykonuje sie przy każdym rerenderze komponentu
//-pusta tablica -> wykonuje się po dodaniu komponentu do html
//-tablica z zależnościami(zmiennymi) -> wykonuje się na początku i przy każdej zmianie wartości z tablicy
//wewnątrz callback do useEffect mamy wywołanie funkcji która pobiera dane, w związku z tym, że jest async
//asynchroniczna (Promise based) to obsługujemy ją przez then i catch.
import {useEffect} from 'react';
useEffect(() => {
    getAllTasks()
        .then((data) => setTask(data))
        .cattch(console.error)
    }, [])

```