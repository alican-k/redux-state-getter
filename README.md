# redux-state-getter
A simple getter object for redux state in react projects (fits best with recompose)

## INSTALLATION
```
npm install --save alican-k/redux-state-getter#master
```

## PROBLEM / SOLUTION

In the examples below, ```connect``` is from ```react-redux``` and functions like ```withProps```
and ```branch``` are from ```recompose```

1. We write same function to connect the application state to components repeatedly.
```javascript
/*  before */
connect(state => ({todos: state.todos}), {...actions})
/*  after  */
connect(todos.self, {...actions})
```
2. We write functions to get data from the application state but those functions can be writen again by the advantages of functional programming.
```javascript
/*  before  */
branch(props => props.todos.status === 'LOADING', renderComponent(Loading))
/*  after  */
branch(todos.isLaoding, renderComponent(Loading))
```
3. We write functions to map props from the application state but we can just give their keys to pick.
```javascript
/*  before  */
withProps(props => ({
    list: props.todos.list, 
    left: props.todos.list.filter(todo => !todo.completed).length
}))
/*  after  */
withProps(todos.pick(['list', 'left']))
```
4. Prop mapper HOCs get application state (say it ```state```) as parameter but in combined reducers we can reach to 
an alt state (say it ```state.todos``` or ```state.profile```). 

    We should be able to use same function for both situations.
```javascript
/*  These statements give same result  */

todos.left(state)           // 'LOADING'
todos.left(state.todos)     // 'LOADING'
```

## API

There is just one function which is exported by default: 
```javascript
createGetter(altStateName: String, getterFunctionMap: Object)
```
```altStateName``` is one of the strings that you used while combining reducers. 

It can be ```'todos'``` or ```'profile'``` in the case below.
```javascript
/*  reducers.js  */
const rootReducer = combineReducers({todos, profile})

/*  getter.js  */

// Functions such as list and left are functions which gets state and return data you want.
const list = prop('list')
const left = compose(length, filter(propEq('completed', false)), list)

export const todos = altState('todos', {list, left, ...})

```

```getterFunctionMap``` is an object whose props are all functions which takes alt state as a single parameter and returns data you want.

```createGetter``` function will give us a ```todos``` getter object, which is like;

```javascript
{
    self: Function,
    pick: Function,
    
    list: Function,
    left: Function
    ...
}
```


## Example

Say that, you have `todos` and `profile` alt states inside the state, such as:

```javascript
{
  todos: {
    list: [
      { title: 'Learn react', completed: true },
      { title: 'Improve coding skills with functional programming', completed: false }
    ],
    status: 'LOADED',
  },
  profile: {
    userName: 'ali-k',
    email   : 'ali@example.com'
    id      : '144554y67'
  }
}
```

The ```Todo```component can be :

```components/Todos.js```
```javascript
import React from 'react'
import {connect} from 'react-redux'
import {compose, withProps, branch} from 'recompose'
import Todo from './Todo'
import EmptyList from './EmptyList'
import TodosLoading from './TodosLoading'
import {todos} from 'path/to/getters.js'

const Todos = ({list, left}) =>
    <div className='todos'>
        <div className='list'>
            { list.map((item, index) => 
                <Todo item={item} key={index} index={index} /> 
            )}
        </div>
        <div className='footer'>
            {left} items left.
        </div>
    </div>
    
export default compose(
    connect(todos.self, null),
    branch(todos.isLoading, renderComponent(TodosLoading)),
    branch(todos.isListEmpty, renderComponent(EmptyList)),
    withProps(todos.pick(['list', left]))
)
```

To use like this, I need to create `todos` and `profile` getter object. 

```javascript
/*
 * Asume that these functions will take state.todos and returns a field or calculated data that you want.
*/

const list           = prop('list')
const isListEmpty    = compose(isEmpty, list)
const left           = compose(length, filter(propEq('completed', false)), list)
const status         = prop('status')
const isLoading      = propEq('LOADING', 'status')

export const todos   = altState('todos', {list, isListEmpty, left, status, isLoading})

/*
 * Asume that these functions will take state.profile and returns a field or calculated data that you want.
*/

const userName       = prop('userName')
const email          = prop('email')
const id             = prop('id')

export const profile = altState('profile', {userName, email, id})

```

As you see, in the getter object, `self` and `pick` property is created for you as well as single field getters that you provided.

