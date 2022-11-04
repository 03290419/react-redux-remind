const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
// 모듈이름/액션의 형태 -> 중복방지용

export const increase = () => ({ type: INCREASE }); // 액션 생성 함수
export const decrease = () => ({ type: DECREASE }); // 액션 생성 함수

const initialState = {
  number: 0,
};
// 초기값

function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return { number: state.number + 1 };
    case DECREASE:
      return { number: state.number - 1 };
    default:
      return state;
  }
}
// 리듀서
export default counter;
