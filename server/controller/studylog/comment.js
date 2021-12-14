const { Comment } = require("../../models");
const { isAccessAuthorized } = require("../functions/token");

module.exports = {
  get: async (req, res) => {
    try {
      const user = isAccessAuthorized(req);

      const date = new Date(
        req.params.date.slice(0, 4),
        req.params.date.slice(4, 6) - 1,
        req.params.date.slice(6, 8)
      );

      const [comment, created] = await Comment.findOrCreate({
        where: { user_id: user.id, date: date },
        defaults: { comment: "" },
        raw: true,
      });

      res.send({ comment: comment.comment });
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

      const updatedComment = await Comment.update(
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
