import { getIsPhone } from "../../utils";
import { ExperienceLevel } from "../user-form/utils";

export const getPathParams = userLevel => {
  const device = getIsPhone() ? "phone" : "tablet";
  var level;

  switch (userLevel) {
    case (ExperienceLevel.Beginner, ExperienceLevel.TriedButQuit):
      level = "beginner";
      break;
    case ExperienceLevel.Intermediate_1:
      level = "intermediate_1";
      break;
    case ExperienceLevel.Intermediate_2:
      level = "intermediate_2";
      break;
    case ExperienceLevel.Advanced:
      level = "advanced";
      break;
    default:
      break;
  }

  return { device, level };
};

export const getLevelForInt = levelInt => {
  var level;
  switch (levelInt) {
    case "0":
      level = ExperienceLevel.TriedButQuit;
      break;
    case "1":
      level = ExperienceLevel.Beginner;
      break;
    case "2":
      level = ExperienceLevel.Intermediate_1;
      break;
    case "3":
      level = ExperienceLevel.Intermediate_2;
      break;
    case "4":
      level = ExperienceLevel.Advanced;
      break;
    default:
      break;
  }
  return level;
};
