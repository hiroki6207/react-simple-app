import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/todos');
      if(!response.ok) {
        throw new Error('ネットワークエラーが発生しました');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (!inputText) return;

    try {
      const response = await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: inputText, 
          status: 0,
        }),
      });
      if(response.ok) {
        setInputText('');
        fetchTodos();
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'DELETE',
      });
      if(response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };
  
  const handleToggle = async (todo) => {
    try {
      const nextStatus = todo.status === 2 ? 0 : 2;
      const response = await fetch(`http://localhost:8080/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: todo.title,
          status: nextStatus,
         }),
      });

      if(response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.title);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: editText,
          status: 0,
         }),
      });

      if (response.ok) {
        setEditId(null);
        setEditText('');
        fetchTodos();
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
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
                <input type="checkbox" checked={todo.status === 2} onChange={() => handleToggle(todo)} />
                <span style={{ textDecoration: todo.status === 2 ? 'line-through' : 'none', marginLeft: '10px' }}>{todo.title}</span>
                <button onClick={() => handleEdit(todo)} style={{ marginLeft: '10px' }}>編集</button>
                <button onClick={() => handleDelete(todo.id)} style={{ marginLeft: '10px' }}>削除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
