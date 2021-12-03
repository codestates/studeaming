const { User, Daily } = require("../../models");
const { isAccessAuthorized } = require("../functions/token");
const { Op } = require("sequelize");

module.exports = {
  get: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);

      const date = new Date(
        req.params.date.slice(0, 4),
        req.params.date.slice(4, 6) - 1,
        req.params.date.slice(6, 8)
      );

      const [daily, created] = await Daily.findOrCreate({
        where: { user_id: user.id, date: date },
        defaults: { comment: "" },
        raw: true,
      });
      console.log(daily, created);
      res.send({ comment: daily.comment });
    } catch (e) {
      res.status(500).send(e);
    }
  },
  patch: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);
      const date = new Date(
        req.params.date.slice(0, 4),
        req.params.date.slice(4, 6) - 1,
        req.params.date.slice(6, 8)
      );

      const updatedComment = await Daily.update(
        { comment: req.body.comment },
        {
          where: {
            user_id: user.id,
            date: date,
          },
        }
      );

      if (updatedComment) {
        res.send({ comment: req.body.comment, message: "Comment updated" });
      } else {
        res.status(500).send();
      }
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
