import {createStore} from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from "@/store/state";


export default createStore({
  state,
  getters,
  mutations,
  actions,
})
