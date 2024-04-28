import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Create from './pages/Create';
import Login from './pages/Login'; // Importe o componente Login
import CreateWorld from './pages/user/CreateWorld'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-world" element={<CreateWorld />} />

          
          <Route
            path="/"
            element={
              <>
                <h1>Bem-Vindo World Building!</h1>
                <p>Um sistema onde você pode organizar seus mundos fictícios.</p>
                <Link to="/create">
                  <button className='comeceAgora'>Comece por aqui!</button>
                </Link>
                <Link to="/login">
                  <button>Login</button>
                </Link>
                
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;