import { getNotReadMessages} from 'api/getMessageNotice';

const actions = {
  async  getNotReadMsg({commit}){
    const allNotReadMsg = await getNotReadMessages();
    if(allNotReadMsg > 0){
      commit('GET_ALLMESSAGE',allNotReadMsg);
      const [applyMsg,approveMsg] = await Promise.all(
        [
          getNotReadMessages(6),
          getNotReadMessages(7)
        ]
      );
      commit('GET_APPLYMESSAGE',applyMsg);
      commit('GET_APPROVEMESSAGE',approveMsg);
    }
  }
};

export default actions;