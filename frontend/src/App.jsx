import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav>
          <Link to="/">Search</Link> | 
          <Link to="/register"> Register</Link> | 
          <Link to="/login"> Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
