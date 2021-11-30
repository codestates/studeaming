import api from "./index";

const toggleAPI = {
  getToggles: () => {
    return api.get(`/studytoggle`);
  },

  makeToggle: (name, color, isOn) => {
    return api.post(`/studytoggle`, { name, color, isOn });
  },

  deleteToggle: (toggleId) => {
    return api.delete(`/studytoggle/${toggleId}`);
  },
};

export default toggleAPI;
