const { createAsyncThunk } = require('@reduxjs/toolkit');

const delay = (time, value) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });

const logIn = createAsyncThunk('user/logIn', async (data, thunkApi) => {
  console.log('data', data);
  // throw new Error('에러발생!!');
  const result = await delay(500, {
    userId: 1,
    nickname: 'messi',
  });
  return result;
});

module.exports = {
  logIn,
};
