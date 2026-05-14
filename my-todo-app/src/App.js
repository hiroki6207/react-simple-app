import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Reactの学習', isCompleted: false },
    { id: 2, text: 'ToDoアプリの実装', isCompleted: false },
    // { id: 3, text: 'Deploy to production', completed: false },
  ]);
  const [inputText, setInputText] = useState('');

  const handleAdd = () => {
    if (!inputText) return;

    const newTodo = {
      id: Date.now(),
      text: inputText,
      isCompleted: false,
    };

    setTodos([...todos, newTodo]);
    setInputText('');
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  const handleToggle = (id) => {
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>ToDoアプリ</h1>
      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="新しいToDoを入力" />
      <button onClick={handleAdd}>追加</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ listStyle: 'none', marginBottom: '10px' }}>
            <input type="checkbox" checked={todo.isCompleted} onChange={() => handleToggle(todo.id)} />
            <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none', marginLeft: '10px' }}>{todo.text}</span>
            <button onClick={() => handleDelete(todo.id)} style={{ marginLeft: '10px' }}>削除</button>
          </li>
        ))}
      </ul>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
