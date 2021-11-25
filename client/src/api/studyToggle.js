import api from "./index";

const toggleAPI = {
  getToggles: async () => {
    return await api.get(`/studytoggle`);
  },

  makeToggle: async (name, color, isOn) => {
    return await api.post(`/studytoggle`, { name, color, isOn });
  },

  deleteToggle: async (toggleId) => {
    return await api.delete(`/studytoggle/${toggleId}`);
  },
};

export default toggleAPI;
