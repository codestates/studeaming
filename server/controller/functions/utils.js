module.exports = {
  getUTC: (date) => {
    try {
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
    } catch {
      return Date.now();
    }
  },
};
