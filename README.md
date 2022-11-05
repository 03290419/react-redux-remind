# Redux 개념 정리

## Action

상태에 어떠한 변화가 필요하면 액션이라는 것이 발생한다. 액션 객체는 반드시 type 필드를 가지고 있어야 한다. 해당 값이 액션의 이름과 같다.
그 외의 값은 상태 업데이트시 참고해야할 값이다.

```js
{
    type:'APP_TODO',
    data: {
        id: 1,
        text: '리덕스 배우기'
    }
}
```

## Action Creator

액션 생성 함수는 액션 객체를 만들어 주는 함수이다.

```js
function addTodo(data) {
  return {
    type: 'APP_TODO',
    data,
  };
}
```

## Reducer

리듀서는 **변화를 일으키는 함수**이다.
액션을 만들어서 발생시키면 리듀서가 *현재 상태*와 *전달받은 액션 객체*를 파라미터로 받아온다. 그리고 두 값을 참조하여 새로운 상태를 만들어서 반환한다.

```js
const initialState = {
  counter: 1,
};
function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        counter: state.counter + 1,
      };
    case DECREMENT:
      return {
        counter: state.counter - 1,
      };
    default:
      return state;
  }
}
```

## Store

프로젝트에 리덕스를 적용하기 위해 스토어(store)를 만든다. 한 개의 프로젝트는 단 하나의 스토어만 가질 수 있다.
스토어 안에는 현재 애플리케이션 상태와 리듀서가 들어있으며, 그 외에도 몇 가지 중요한 내장 함수를 지닌다.

## Dispatch

디스패치는 스토어의 내장 함수 중 하나이다. 디스패치는 **액션을 발생 시키는 것** 이다. 이 함수는 dispatch(action)과 같은 형태로 액션 객체를 파라미터로 넣어서 호출한다.
이 함수가 _호출되면_ 스토어는 *리듀서 함수를 실행*시켜서 새로운 상태를 만들어준다.

실행 흐름
`dispatch` -> `reducer` -> new state

## subscribe

구독도 스토어의 내장 함수 중 하나이다. subscribe 함수 안에 리스너 함수를 파라미터로 넣어서 호출해 주면 이 리스너 함수가 **액션이 디스패치되어 상태가 업데이트 될 때마다** 호출된다.

```js
const listener = () => {
  console.log('상태가 업데이트 됨');
};
const unsubscribe = store.subscribe(listener);
unsubscribe(); // 추후 구독을 비활성화할 때 함수를 호출
```

## Redux 3 Rules

- 단일 스토어 :
  하나의 애플리케이션 안에는 하나의 스토어가 있다.
- 읽기 전용 상태 :
  redux는 읽기 전용이다. 상태를 업데이트 할 때 기존의 객체는 건드리지 않고 새로운 객체를 생성해 주어야 한다.
  redux에서 불변성을 유지해야 하는 이유는 내부적으로 데이터가 변경되는 것을 감지하기 위해 얕은 비교(shallow equality) 검사를 하기 때문이다.
- Reducer는 순수한 함수 :
  변화를 일으키는 리듀서는 순수한 함수여야 한다. 순수한 함수는 다음 조건을 만족한다.
  - 리듀서 함수는 이전 상태와 액션 객체를 파라미터로 받는다.
  - 파라미터 외의 값에는 의존하면 안 된다.
  - 이전 상태는 절대로 건드리지 않고, 변화를 줄 새로운 상태 객체를 만들어서 반환한다.
  - 똑같은 파라미터로 호출된 리듀서 함수는 언제나 똑같은 결과 값을 반환해야 한다.

## React-redux

컴포넌트를 redux와 연결하려면 react-redux에서 제공하는 connect 함수를 사용한다.
`connect(mapStateToProps, mapDispatchToProps)(연동할 컴포넌트)`
여기서 mapStateToProps 는 리덕스 스토어 안의 상태를 컴포넌트의 props로 넘겨주기 위해 설정하는 함수이고,
mapDispatchToProps 는 액션 생성 함수를 컴포넌트의 props로 넘겨주기 위해 사용하는 함수이다.

```js
const mapStateToProps = (state) => ({
  number: state.counter.number,
});
const mapDispatchToProps = (dispatch) => ({
  increase: () => {
    dispatch(increase());
  },
  decrease: () => {
    dispatch(decrease());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
```

익명함수로 단축

```js
export default connect(
  (state) => ({
    number: state.counter.number,
  }),
  (dispatch) => ({
    increase: () => {
      dispatch(increase());
    },
    decrease: () => {
      dispatch(decrease());
    },
  }),
)(CounterContainer);
```

redux의 bindActionCreators를 사용했을 때

```js
export default connect(
  (state) => ({
    number: state.counter.number,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        increase,
        decrease,
      },
      dispatch,
    ),
)(CounterContainer);
```

## useSelector

redux 스토어와 연동된 컨테이너 컴포넌트를 만들 때, connect 함수를 사용하는 대신 react-redux에서 제공하는 Hooks를 사용할 수도 있다.

`const 결과 = useSelector(상태 선택 함수)`
여기서 상태 선택 함수는 mapStateToProps 와 형태가 똑같다.

```js
const number = useSelector((state) => state.counter.number);
```

## useDispatch

이 Hook은 컴포넌트 내부에서 스토어의 내장 함수 dispatch를 사용할 수 있게 해 준다. 컨테이너 컴포넌트에서 액션을 디스패치해야 한다면 이 Hook을 사용하면 된다.

```js
const dispatch = useDispatch();
dispatch({ type: 'SAMPLE_ACTION' });
```

useDispatch를 사용할 때는 useCallback 과 함께 사용하는 것을 습관화 하자.

## useStore

이 Hook을 사용하면 컴포넌트 내부에서 리덕스 스토어 객체를 직접 사용할 수 있다.

```js
const store = useStore();
store.dispatch({ type: 'SAMPLE_ACTION' });
store.getState();
```

useStore은 정말 어쩌다 스토어에 직접 접근해야 하는 상황에만 사용한다.

# Redux-actions

redux actions를 사용하면 액션 생성 함수를 더 짧은 코드로 작성할 수 있다. 리듀서를 작성할 때도 switch/case 문이 아닌 handleActions라는 함수를 사용하여 각 액션마다 업데이트 함수를 설정하는 형식으로 작성해 줄 수 있다.
`yarn add redux-actions`

- createAction

```js
export const increase = () => createAction(INCREASE); // 액션 생성 함수
export const decrease = () => createAction(DECREASE); // 액션 생성 함수
```

createAction 을 사용하면 매번 객체를 직접 만들어 줄 필요 없이 더욱 간단하게 액션 생성 함수를 선언할 수 있다.
createAction 을 사용하면 커스텀해서 주어주던, 액션에 필요한 추가 데이터는 payload라는 이름을 사용한다.

```js
const MY_ACTION = 'sample/MY_ACTION';
const myAction = createAction(MY_ACTION);
const action = myAction('hello world');

//결과: {type: MY_ACTION, payload: 'hello world'}
```

액션 생성함수에서 받아 온 파라미터를 그대로 payload에 넣는 것이 아니라 변형을 주어서 넣고 싶다면, createAction의 두 번째 함수에 payload 를 정의하는 함수를 따로 선언해서 넣어주면 된다.

```js
const MY_ACTION = 'sample/MY_ACTION';
const myAction = createAction(MY_ACTION, (text) => `${text}!`);
const action = myAction('hello world');

//결과: {type: MY_ACTION, payload: 'hello world!'}
```

- handleActions

```js
const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 }),
    [DECREASE]: (state, action) => ({ number: state.number - 1 }),
  },
  initialState,
);
```

handleActions로 reducer를 간략하게 작성할 수 있다.
함수의 첫 번째 파라미터에는 각 액션에 대한 업데이트 함수를 넣어주고, 두 번째 파라미터에는 초기 상태를 넣어준다.
