const { User } = require("../../models");

module.exports = async (name) => {
  name = name || "회원";
  //return unique name
  const count = await User.count({
    where: {
      username: name,
    },
  });
  if (count) {
    return name + count.toString(); //todo: 한글 닉네임 만들어주기
  } else {
    return name;
  }
};
