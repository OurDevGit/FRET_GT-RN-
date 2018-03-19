export const Popover = {
  Birthdate: "Birthdate",
  ExperienceLevel: "ExperienceLevel"
};

export const ExperienceLevel = {
  TriedButQuit: "Tried but Quit",
  Beginner: "Beginner",
  Intermediate_1: "Intermediate I",
  Intermediate_2: "Intermediate II",
  Advanced: "Advanced"
};

export const getBirthdates = () => {
  let latestYear = new Date().getFullYear() - 8;
  var years = [];

  for (var i = latestYear; i >= latestYear - 72; i--) {
    years.push(`${i}`);
  }

  return years;
};

export const getExperienceLevels = () => {
  return [
    ExperienceLevel.TriedButQuit,
    ExperienceLevel.Beginner,
    ExperienceLevel.Intermediate_1,
    ExperienceLevel.Intermediate_2,
    ExperienceLevel.Advanced
  ];
};
