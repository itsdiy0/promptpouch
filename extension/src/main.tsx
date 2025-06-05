import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'
import { Provider } from '@urql/preact';
import client from './client';

render(
    <Provider value={client}>
      <App />
    </Provider>,
    document.getElementById('app')!
  );
