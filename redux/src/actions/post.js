const { createAsyncThunk } = require('@reduxjs/toolkit');

const delay = (time, value) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });

const addPost = createAsyncThunk('post/add', async (data, thunkApi) => {
  console.log(data);
  throw new Error('ㅌㅌㅌㅌ');
  const result = await delay(500, {
    id: 1,
    content: 'zzzzzz',
  });

  return result;
});

module.exports = {
  addPost,
};
