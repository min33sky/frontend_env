const { createSlice } = require('@reduxjs/toolkit');
const { addPost } = require('../actions/post');

const initialState = {
  data: [],
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // 동기, post 내부와 관련
    clearPost(state, action) {
      state.data = [];
    },
  },
  extraReducers: builder =>
    builder
      .addCase(addPost.pending, (state, action) => {})
      .addCase(addPost.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.error;
      }),
});

module.exports = postSlice;
