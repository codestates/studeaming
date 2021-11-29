const { Currentlog } = require("../models");
const { isAccessAuthorized } = require("./functions/tokenFunc");

module.exports = {
  get: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);

      const toggleList = await Currentlog.findAll({
        where: { user_id: user.id },
        attributes: ["id", "name", "color", "isOn"],
        raw: true,
      });

      if (toggleList) {
        res.send({ toggleList: toggleList });
      } else {
        res.sendStatus(500);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },
  post: async (req, res) => {
    try {
      const user_id = isAccessAuthorized(req).id;
      const { name, color, isOn } = req.body;

      const newToggle = await Currentlog.create({ user_id, name, color, isOn });

      if (newToggle) {
        res.send({ newToggle: { id: newToggle.id } });
      } else {
        res.sendStatus(500);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },
  delete: async (req, res) => {
    try {
      const user_id = isAccessAuthorized(req).id;

      await Currentlog.destroy({
        where: { user_id: user_id, id: req.params.id },
      });

      res.sendStatus(204);
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
