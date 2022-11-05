import { createAction, handleActions } from 'redux-actions';
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
// 모듈이름/액션의 형태 -> 중복방지용

export const increase = createAction(INCREASE); // 액션 생성 함수
export const decrease = createAction(DECREASE); // 액션 생성 함수

const initialState = {
  number: 0,
};
// 초기값

const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 }),
    [DECREASE]: (state, action) => ({ number: state.number - 1 }),
  },
  initialState,
);

// 리듀서
export default counter;
