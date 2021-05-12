const { createSlice } = require('@reduxjs/toolkit');
const { logIn } = require('../actions/user');

const initialState = {
  isLoggingIn: false,
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut(state, action) {
      state.data = null;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(logIn.pending, (state, action) => {})
      .addCase(logIn.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.data = null;
      })
      .addMatcher(
        action => action.type.includes('/pending'),
        (state, action) => {
          state.isLoggingIn = true;
        },
      )
      .addMatcher(
        action => action.type.includes('/fulfilled'),
        (state, action) => {
          state.isLoggingIn = false;
        },
      )
      .addMatcher(
        action => action.type.includes('/rejected'),
        (state, action) => {
          state.isLoggingIn = false;
        },
      )
      .addDefaultCase((state, action) => {
        // default
      }),
});

module.exports = userSlice;
