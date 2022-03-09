import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthPage from './components/Authentication/AuthPage';
import ChatPage from './components/Chats/ChatPage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthPage/>}/>
        <Route path="/chats" element={<ChatPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
