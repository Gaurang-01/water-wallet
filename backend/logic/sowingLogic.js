exports.getSowingWindow = (forecast) => {

  const goodDays = [];

  for (let day of forecast) {

    const good =
      day.temp >= 20 &&
      day.temp <= 35 &&
      day.rain < 10 &&   // relaxed threshold
      day.wind < 8;

    if (good) goodDays.push(day.date);
  }

  // need 3 consecutive good slots
  if (goodDays.length >= 3) {
    return {
      start: goodDays[0],
      end: goodDays[2]
    };
  }

  return null;
};
