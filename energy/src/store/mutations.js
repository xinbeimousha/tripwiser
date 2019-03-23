 import * as types from './mutation-types';

 const mutations = {
   [types.SET_ALIVEPAGE](state,name){
     state.includePageNames.push(name);
   },
   [types.DELETE_ALIVEPAGE](state,index){
     state.includePageNames.splice(index,1);
   },
   [types.GET_ALLMESSAGE](state,num){
     state.messageNotice.allMessage = num;
   },
   [types.GET_APPLYMESSAGE](state,num){
    state.messageNotice.applyMessage = num;
  },
  [types.GET_APPROVEMESSAGE](state,num){
    state.messageNotice.approveMessage = num;
  },
 }

 export default mutations;
