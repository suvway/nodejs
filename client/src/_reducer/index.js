import { combineReducers } from 'redux';//state가 변화하고 그 값을 return 하는게 reducer
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;