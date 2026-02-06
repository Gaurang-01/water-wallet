exports.generateAdvisory = (crop, cropResult, suggestions, sowingWindow) => {

  if (cropResult.status === "PASS") {
    return `${crop} is safe to sow. Water availability is sufficient.`;
  }

  let alt = suggestions.length ? suggestions[0].crop : "low water crops";

  let windowText = "";

  if (sowingWindow) {
    windowText = ` Best sowing window: ${sowingWindow.start} to ${sowingWindow.end}.`;
  }

  return `${crop} not recommended due to water deficit. Consider ${alt}.${windowText}`;
};
