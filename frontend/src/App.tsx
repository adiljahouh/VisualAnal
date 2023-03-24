import './App.css';
import Dashboard from './components/dashboard/Dashboard';
import { DateContextProvider } from './components/Treemap/Context/DateContext/DateContext';

function App() {
  return (
    <DateContextProvider>
      <Dashboard />
    </DateContextProvider>
  );
}

export default App;
