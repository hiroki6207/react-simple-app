import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

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

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if(!response.ok) {
        throw new Error('カテゴリ取得エラーが発生しました');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }

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
          category_id: categoryId ? parseInt(categoryId) : null,
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

  const handleAddCategory = async (name) => {
    try{
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name,
        }),
      });
      if(response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }

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
    <Router>
      <div className="App" style={{ padding: '20px' }}>
        <h1>ToDoアプリ</h1>
        <nav style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <Link to='/' style={{ marginRight: '15px', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>タスク一覧</Link>
          <Link to='/add' style={{  marginRight: '15px', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>➕ タスク追加ページ</Link>
          <Link to='/categories' style={{  fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>カテゴリ管理</Link>
        </nav>

        <Routes>
          <Route path='/' element={
            <TodoListPage
            todos={todos}
            categories={categories}
            editId={editId}
            editText={editText}
            setEditText={setEditText}
            setEditId={setEditId}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            />
          } />

            <Route path='/add' element={
              <TodoCreatePage onAddTodo={handleAdd} categories={categories} />
            } />

            <Route path='/categories' element={
              <CategoryPage categories={categories} onAddCategory={handleAddCategory} />
            } />
        </Routes>
      </div>
    </Router>
  );
}

function TodoCreatePage({ onAddTodo, categories }) {
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const onSubmit = () => {
    if(!text) return;
    onAddTodo(text, selectedCategory);
    setText('');
    navigate('/');
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
      <h2>➕ 新しいタスクの追加</h2>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>タスク名：</label>
        <input 
          type='text' value={text} onChange={(e) => setText(e.target.value)} 
          placeholder='' 
          style={{ width: '300px', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>カテゴリーの選択：</label>
        <select 
          value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} 
          style={{ width: '316px', padding: '8px' }}
        >
          <open value=''>-- カテゴリなし --</open>
          {categories.map(cat => (
            <open key={cat.id} value={cat.id}>{cat.name}</open>
          ))}
        </select>
      </div>

      <button onClick={onSubmit} style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
        データベースに登録して一覧へ戻る
      </button>
    </div>
  );
}

function CategoryPage({ categories, onAddCategory }) {
  const [categoryName, setCategoryName] = useState('');

  const onSubmit = () => {
    if(!categoryName) return;
    onAddCategory(categoryName);
    setCategoryName('');
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fff3e0' }}>
      <h2>カテゴリーの管理</h2>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type='text' value={categoryName} onChange={(e) => setCategoryName(e.target.value)} 
          placeholder='新しいカテゴリ名' 
          style={{ padding: '8px', width: '250px' }}
        />
        <button onClick={onSubmit} style={{ padding: '8px 15px', marginLeft: '10px', backgroundColor: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ➕ カテゴリを追加
        </button>
      </div>

      <h3>現在のカテゴリー一覧：</h3>
      <ul>
        {categories.map(cat => (
          <li key={cat.id} style={{ marginBottom: '5px', fontSize: '16px', fontWeight: 'bold', color: 'e65100' }}>
            ・{cat.name} <span style={{ fontSize: '12px', color: '#999', fontWeight: 'normal' }}>(ID: {cat.id})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
