import { handleActions } from 'redux-actions';
import { ADD_TODO, REMOVE_TODO, CLEAR_ALL } from '../actions/action-types';

const initialState = {
  todo: []
}

const todoReducer = handleActions({
  [ADD_TODO]: (state, action) => {
    return ({ ...state, todo: state.todo? [...state.todo, action.payload] : [action.payload] })},
  [REMOVE_TODO]: (state, action) => {
    const index = state.todo.findIndex( item => item.id === action.payload);
    if (index !== -1) {
      state.todo.splice(index, 1);
    }
    return {
      ...state,
      todo: [...state.todo]
    };
  },
  [CLEAR_ALL]: state => ({...state, todo: []})
}, initialState);

export default todoReducer;