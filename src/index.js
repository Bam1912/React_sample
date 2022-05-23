import React from 'react';
import { createRoot} from 'react-dom/client'
import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { createStore } from "redux";
// import { rootReducer } from './Redux/rootReducer';
import { Provider as ReduxProvider} from 'react-redux';
import { store } from './Redux'
import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client"

// const store = createStore(rootReducer)

const client = new ApolloClient({
  //uri: 'http://localhost:8000/graphql.php',
  uri: 'https://levelfive.ru/api/graphql.php',
  cache: new InMemoryCache(),
})

const root = createRoot(document.getElementById('root'))

root.render( 
  // <React.StrictMode> // в 18й версии в стрикт моде некоторые не адаптированные библиотеки вызывают двойные рендеры компонентов
    <ReduxProvider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </ReduxProvider>
  // </React.StrictMode>
  
  )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
