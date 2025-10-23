import { createStore, applyMiddleware, combineReducers} from 'redux';
import { thunk } from 'redux-thunk';
import { login } from '../reducers/LoginReducer';
import { BloDetails } from '../reducers/ElectorDetailsReducers';
import { commanApi } from '../reducers/commanReducers';
import { bothDistriCollectApi } from '../reducers/BothDistriCollectReducers';

const rootReducer = combineReducers({
    login:login,
    BloDetails:BloDetails,
    commanApi:commanApi,
    bothDistriCollectApi:bothDistriCollectApi,
});

//create and maintain single store for the application
const store=  createStore(rootReducer, applyMiddleware(thunk))

export default store;