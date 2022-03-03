import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthPage from './components/Authentication/AuthPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
