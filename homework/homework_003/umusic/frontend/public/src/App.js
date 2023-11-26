import logo from './logo.svg';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocketConnection from "./components/SocketConnection";

function App() {
  const handleConnect = () => {
    console.log('Connected to server');
  };

  const handleDisconnect = () => {
    console.log('Disconnected from server');
  };

  const handleServerName = (data) => {
    console.log(data);
    toast.info(`Connected to server: ${data}`);
  };

  const handlePing = (data) => {
    console.log(data);
    toast.info(`Ping received at ${new Date(parseInt(data)).toLocaleString()}`, {
      theme: 'colored',
      position: 'bottom-right',
      autoClose: 500,
      closeOnClick: true,
    });
  };

  const handleUserLogin = (user) => {
    toast.info(`New User Login \n${user.name}`, {
      theme: 'colored',
      position: 'bottom-left',
      autoClose: 500,
      closeOnClick: true,
    });
    console.log(user);
  };

  const handleUserRegister = (user) => {
    toast.info(`New User Registered \n${user.name}`, {
      theme: 'colored',
      position: 'bottom-left',
      autoClose: 500,
      closeOnClick: true,
    });
    console.log(user);
  };

  return (
  <div className="App">
    <ToastContainer/>
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer">
        Learn React
      </a>
    </header>

    <SocketConnection
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      onServerName={handleServerName}
      onPing={handlePing}
      onUserLogin={handleUserLogin}
      onUserRegister={handleUserRegister}/>
  </div>
  );
}

export default App;