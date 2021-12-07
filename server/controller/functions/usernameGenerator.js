const { User } = require("../../models");
const { v4 } = require("uuid");
const { Op } = require("sequelize");

module.exports = async (name) => {
  name = (name || "회원") + v4().slice(0, 5);
  //return unique name
  const count = await User.count({
    where: {
      username: {
        [Op.like]: `%${name}`,
      },
    },
  });
  if (count) {
    return name + count;
  } else {
    return name;
  }
};
