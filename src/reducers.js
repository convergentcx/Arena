import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle';
import { connectRouter } from 'connected-react-router';

// import { CACHE_BLOCK } from './actions';

// const cacheBlock = (state = [], action) => {
//   switch (action.type) {
//     case CACHE_BLOCK:
//       return [
//         ...state,
//         action.block.event,
//       ];
//     default:
//       return state;
//   };
// };

export default history =>
  combineReducers({
    router: connectRouter(history),
    ...drizzleReducers,
    // cacheBlock,
  });
