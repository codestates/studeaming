import api from "./index";

const toggleAPI = {
  getToggles: () => {
    return api.get(`/studytoggle`);
  },

  makeToggle: (name, color) => {
    return api.post(`/studytoggle`, { name, color });
  },

  deleteToggle: (toggleId) => {
    return api.delete(`/studytoggle/${toggleId}`);
  },
};

export default toggleAPI;
