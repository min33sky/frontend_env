const { configureStore, getDefaultMiddleware } = require('@reduxjs/toolkit');

const reducer = require('../reducers');

const loggingMiddleware = store => next => action => {
  console.log('Logging', action);
  next(action);
};

const store = configureStore({
  reducer,
  middleware: [loggingMiddleware, ...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== 'production',
});

module.exports = store;
