"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Achievements",
      [
        {
          name: "공부 기록 시작하기",
          emoticon: "✍️",
          color: "yellow",
          description: "나만의 토글을 생성하고 로그를 남겨보세요.",
        },
        {
          name: "스터디밍 첫 시작",
          emoticon: "🎥",
          color: "green",
          description: "열심히 공부하는 모습을 스트리밍 해보세요.",
        },
        {
          name: "공부시간 100시간 달성",
          emoticon: "⏰",
          color: "red",
          description: "",
        },
        {
          name: "스터디밍 100시간 달성",
          emoticon: "🎬",
          color: "orange",
          description: "",
        },
        {
          name: "스터디밍 시청 100시간 달성",
          emoticon: "👀",
          color: "blue",
          description: "",
        },
        {
          name: "반나절 공부하기",
          emoticon: "📚",
          color: "aqua",
          description: "대단해요, 하루의 반 이상을 공부하셨네요!",
        },
        {
          name: "팔로워 수 10명 달성",
          emoticon: "😎",
          color: "purple",
          description: "함께 공부하고싶은 스터디머가 되어보세요!",
        },
        {
          name: "완벽한 일주일",
          emoticon: "💯",
          color: "pink",
          description: "매일 4시간 이상 일주일간 공부 기록을 남겨보세요.",
        },
        {
          name: "비밀 미션",
          emoticon: "🤫",
          color: "indigo",
          description: "공부만큼 휴식도 중요하다는 것만 잊지마세요!",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Achievements", null, {});
  },
};
