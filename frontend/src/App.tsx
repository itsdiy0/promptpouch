import './App.css';
import { RelayProvider } from './relay/RelayProvider';
import PromptsList from './components/PromptsList';
import CreatePrompt from './components/CreatePrompt';
import Register from './components/Register';
function App() {
  return (
    <RelayProvider>
      <Register>
      </Register>
    </RelayProvider>
  );
}

export default App;
