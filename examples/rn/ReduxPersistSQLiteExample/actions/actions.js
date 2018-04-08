import { ADD_TODO, REMOVE_TODO, CLEAR_ALL } from './action-types';
export function addTodo(data) {
  return dispatch => {
    dispatch({ type: ADD_TODO, payload: data});
  }
}

export function removeTodo(id) {
  return dispatch => {
    dispatch({ type: REMOVE_TODO, payload: id});
  }
}

export function cleatAll() {
  return dispatch => {
    dispatch({ type: CLEAR_ALL });
  }
}
