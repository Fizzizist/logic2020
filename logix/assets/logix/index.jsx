import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import store from './store/index';
import {Provider} from 'react-redux';

ReactDOM.render(
    <Provider store={store}>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />
      <App />
    </Provider>,
    document.getElementById('react')
);
