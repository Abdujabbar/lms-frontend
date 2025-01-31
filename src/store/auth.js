import axios from "@/api/backend.js";
import jwtDecode from "jwt-decode";

export default {
  namespaced: true,
  state: () => ({
    user: null,
    token: null,
    redirectAfterLogin: null,
  }),
  getters: {
    isAuthenticated: (state, getters) => {
      return state.user !== null && state.token !== null && getters.isTokenValid;
    },
    isTokenValid: (state) => {
      const { exp } = jwtDecode(state.token);
      return exp > Math.ceil(Date.now() / 1000);
    },
  },
  actions: {
    async REQUEST_PASSWORDLESS_TOKEN(_, { email }) {
      const lowercased = email.toLowerCase();
      return axios.get(`/api/v2/auth/passwordless-token/request/${lowercased}/`);
    },
    async EXCHANGE_PASSWORDLESS_TOKEN_TO_JWT({ commit, dispatch }, { passwordlessToken }) {
      const response = await axios.get(`/api/v2/auth/passwordless-token/${passwordlessToken}`);

      commit("SET_TOKEN", response.data.token);
      await dispatch("FETCH_USER");
    },
    async LOGIN_WITH_USER_ID({ commit, dispatch }, { id }) {
      // superuser only
      const response = await axios.get(`/api/v2/auth/as/${id}/`);
      commit("SET_TOKEN", response.data.token);

      await dispatch("FETCH_USER");
    },
    async LOGIN_WITH_CREDENTIALS({ commit, dispatch }, credentials) {
      credentials.username = credentials.username.toLowerCase();
      const response = await axios.post("/api/v2/auth/token/", credentials);

      commit("SET_TOKEN", response.data.token);

      await dispatch("FETCH_USER");
    },
    async FETCH_USER({ commit }) {
      const response = await axios.get(`/api/v2/users/me/`);

      commit("SET_USER", response.data);
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_REDIRECT_AFTER_LOGIN(state, where) {
      state.redirectAfterLogin = where;
    },
    RESET(state) {
      state.user = null;
      state.token = null;
    },
  },
};
