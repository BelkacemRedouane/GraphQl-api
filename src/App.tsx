// src/App.tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import CharactersList from './CharactersList'; // Ce composant sera créé dans la prochaine étape

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Personnages de Rick & Morty</h1>
        <CharactersList />
      </div>
    </ApolloProvider>
  );
}

export default App;

