import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from './actions/post';
import userSlice from './reducers/user';
const { logIn } = require('./actions/user');

const App = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(
      logIn({
        id: 'messi',
        password: '12345',
      }),
    );
  }, []);

  const onLogout = useCallback(() => {
    dispatch(userSlice.actions.logOut());
  }, []);

  const handleClick = () => {
    dispatch(addPost());
  };

  return (
    <div>
      {user.isLoggingIn ? (
        <div>로그인 중</div>
      ) : user.data ? (
        <div>{user.data.nickname}</div>
      ) : (
        '로그인 해주세요'
      )}
      {!user.data ? (
        <button onClick={onClick}>로그인</button>
      ) : (
        <button onClick={onLogout}>로그아웃</button>
      )}
      <button onClick={handleClick}>게시물 추가</button>
    </div>
  );
};

export default App;
