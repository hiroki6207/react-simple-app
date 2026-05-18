import './App.css';
import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Reactの学習', isCompleted: false },
    { id: 2, text: 'ToDoアプリの実装', isCompleted: false },
    // { id: 3, text: 'Deploy to production', completed: false },
  ]);
  const [inputText, setInputText] = useState('');

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

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

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const handleUpdate = (id) => {
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, text: editText } : todo));
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>ToDoアプリ</h1>
      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="新しいToDoを入力" />
      <button onClick={handleAdd}>追加</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ listStyle: 'none', marginBottom: '10px' }}>
            {editId === todo.id ? (
              <>
                <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => handleUpdate(todo.id)} style={{ marginLeft: '10px' }}>更新</button>
                <button onClick={() => setEditId(null)} style={{ marginLeft: '10px' }}>キャンセル</button>
              </>
            ) : (
              <>
                <input type="checkbox" checked={todo.isCompleted} onChange={() => handleToggle(todo.id)} />
                <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none', marginLeft: '10px' }}>{todo.text}</span>
                <button onClick={() => handleEdit(todo)} style={{ marginLeft: '10px' }}>編集</button>
                <button onClick={() => handleDelete(todo.id)} style={{ marginLeft: '10px' }}>削除</button>
              </>
            )}
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
