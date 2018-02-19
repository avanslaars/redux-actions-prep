// import { createAction } from 'redux-actions'
// import { createAction, createActions, handleAction, handleActions, combineActions } from 'redux-actions'
import { handleAction, createActions, handleActions, combineActions } from 'redux-actions'
import {getTodos, createTodo, updateTodo, destroyTodo} from './lib/todoServices'

const fixCase = (str) => {
  return str.split('').reduce((acc, letter, idx) => {
    return idx === 0 ? letter.toUpperCase() : `${acc}${letter.toLowerCase()}`
  }, '')
}

const initState = {
  todos: [],
  currentTodo: '',
  isLoading: true,
  message: ''
}

const identity = x => x
//
const UPDATE_CURRENT = 'UPDATE_CURRENT'
const ADD_TODO = 'ADD_TODO'
const LOAD_TODOS = 'LOAD_TODOS'
const REPLACE_TODO = 'REPLACE_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const SHOW_LOADER = 'SHOW_LOADER'
const HIDE_LOADER = 'HIDE_LOADER'
// const TOGGLE_LOADER = 'TOGGLE_LOADER'

// export const updateCurrent = (val) => ({type:UPDATE_CURRENT, payload: val})
// export const updateCurrent = createAction(UPDATE_CURRENT, fixCase)

const {showLoader, hideLoader} = createActions({
  SHOW_LOADER: () => true,
  HIDE_LOADER: () => false
})

export const {updateCurrent, loadTodos, addTodo, replaceTodo, removeTodo} = createActions({
  UPDATE_CURRENT: fixCase,
  ADD_TODO: [identity, (_, name) => ({name})],
  LOAD_TODOS: identity,
  REPLACE_TODO: identity,
  REMOVE_TODO: identity
})

// export {updateCurrent}

// export const {updateCurrent, loadTodos, addTodo, replaceTodo, removeTodo, showMessage}

// export const updateCurrent = currentUpdate
// export const loadTodos = todosLoad
// export const addTodo = todoAdd
// export const replaceTodo = todoReplace
// export const removeTodo = todoRemove
//
// const showMessage = messageShow

// export const updateCurrent = (val) => ({type:UPDATE_CURRENT, payload: val})
// export const loadTodos = (todos) => ({type: LOAD_TODOS, payload: todos})
// export const addTodo = (todo) => ({type: ADD_TODO, payload: todo})
// export const replaceTodo = (todo) => ({type: REPLACE_TODO, payload: todo })
// export const removeTodo = (id) => ({type: REMOVE_TODO, payload: id})
// export const showLoader = () => ({type: TOGGLE_LOADER, payload: true})
// export const hideLoader = () => ({type: TOGGLE_LOADER, payload: false})

export const fetchTodos = () => {
  return (dispatch) => {
    dispatch(showLoader())
    getTodos()
      .then(todos => {
        dispatch(loadTodos(todos))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(loadTodos(error))
        dispatch(hideLoader())
      })
  }
}

export const saveTodo = (name) => {
  return (dispatch) => {
    dispatch(showLoader())
    createTodo(name)
      .then(res => {
        dispatch(addTodo(res))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(addTodo(error))
        dispatch(hideLoader())
      })
  }
}
// export const saveTodo = (name) => {
//   return (dispatch) => {
//     dispatch(showLoader())
//     createTodo(name)
//       .then(res => {
//         dispatch(addTodo(res))
//         dispatch(hideLoader())
//       })
//       .catch(error => {
//         dispatch(addTodo(error, name)) // Passing name as 2nd arg - used in meta handler to include data with error
//         dispatch(hideLoader())
//       })
//   }
// }

export const toggleTodo = (id) => {
  return (dispatch, getState) => {
    dispatch(showLoader())
    const {todos} = getState()
    const todo = todos.find(t => t.id === id)
    const toggled = {...todo, isComplete: !todo.isComplete}
    updateTodo(toggled)
      .then(res => {
        dispatch(replaceTodo(res))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(replaceTodo(error))
        dispatch(hideLoader())
      })
  }
}

export const deleteTodo = (id) => {
  return (dispatch) => {
    dispatch(showLoader())
    destroyTodo(id)
      .then(() => {
        dispatch(removeTodo(id))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(removeTodo(error))
        dispatch(hideLoader())
      })
  }
}

export const getVisibleTodos = (todos, filter) => {
  switch(filter) {
    case 'active':
      return todos.filter(t => !t.isComplete)
    case 'completed':
      return todos.filter(t => t.isComplete)
    default:
      return todos
  }
}

// export default handleAction(TODOS_LOAD, (state, action) => ({...state, todos: action.payload}))

// export default handleActions({
//   LOAD_TODOS: {
//     next: (state, action) => ({...state, message: '', todos: action.payload}),
//     throw: (state, action) => ({...state, message: 'There was an error loading todos'})
//   },
//   UPDATE_CURRENT: (state, action) => ({...state, currentTodo: action.payload}),
//   ADD_TODO: {
//     next: (state, action) => ({...state, message: '', currentTodo: '', todos: state.todos.concat(action.payload)}),
//     throw: (state, action) => ({...state, message: `There was an error saving the todo: ${action.meta.name}`})
//   },
//   REPLACE_TODO: {
//     next: (state, action) => ({...state, message: '', todos: state.todos.map(t => t.id === action.payload.id ? action.payload : t)}),
//     throw: (state, action) => ({...state, message: 'There was an error updating todo'})
//   },
//   REMOVE_TODO: {
//     next: (state, action) => ({...state, message: '', todos: state.todos.filter(t => t.id !== action.payload)}),
//     throw: (state, action) => ({...state, message: 'There was an error removing todo'})
//   },
//   [combineActions(showLoader, hideLoader)]: (state, action) => ({...state, isLoading: action.payload})
// }, initState)

// const loadTodoReducer = handleAction(LOAD_TODOS, (state, action) => ({...state, todos: action.payload}), initState)
//
export default (state = initState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {...state, currentTodo: '', todos: state.todos.concat(action.payload)}
    // case LOAD_TODOS:
    //   return loadTodoReducer(state, action)
    case LOAD_TODOS:
      return {...state, todos: action.payload}
    case UPDATE_CURRENT:
      return {...state, currentTodo: action.payload}
    case REPLACE_TODO:
      return {...state,
        todos: state.todos
          .map(t => t.id === action.payload.id ? action.payload : t)
      }
    case REMOVE_TODO:
      return {...state,
        todos: state.todos.filter(t => t.id !== action.payload)
      }
    case SHOW_LOADER:
    case HIDE_LOADER:
      return {...state, isLoading: action.payload}
    default:
      return state
  }
}
