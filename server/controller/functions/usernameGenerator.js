const { User } = require("../../models");
const { v4 } = require("uuid");

module.exports = async (name) => {
  name = name || v4().slice(0, 5);
  //return unique name
  const count = await User.count({
    where: {
      username: name,
    },
  });
  if (count) {
    return name + count + v4().slice(0, 5);
  } else {
    return name;
  }
};
