import Vue from 'vue'
import Vuex from 'vuex'
import axios from "../src/common/interface/axios.decoration"
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 小微园信息
        parkName:'',
        parkId:0,
        
    },
    getters: {
        
    },
    mutations: {
        // 小微园信息
        setParkName(state, parkName){
            state.parkName = parkName
        },
        setParkId(state, id) {
            state.parkId = id
        }
    },
    actions: {
    },
    modules: {}
})
