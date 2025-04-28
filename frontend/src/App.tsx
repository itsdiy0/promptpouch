import './App.css';
import { RelayProvider } from './relay/RelayProvider';
import PromptsList from './components/PromptsList';

function App() {
  return (
    <RelayProvider>
      <div className="App">
        <header className="App-header">
          <h1>PromptPouch</h1>
        </header>
        <main>
          <PromptsList />
        </main>
      </div>
    </RelayProvider>
  );
}

export default App;
