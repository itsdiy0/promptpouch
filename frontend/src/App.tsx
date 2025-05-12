import './App.css';
import { RelayProvider } from './relay/RelayProvider';
import PromptsList from './components/PromptsList';
import CreatePrompt from './components/CreatePrompt';
function App() {
  return (
    <RelayProvider>
      <div className="App">
        <header className="App-header">
          <h1>PromptPouch</h1>
        </header>
        <main>
          <PromptsList />
          <CreatePrompt />
        </main>
      </div>
    </RelayProvider>
  );
}

export default App;
