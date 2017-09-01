import PropTypes from "prop-types";

export const ModalType = {
  Full: "ModalType.Full",
  Center: "ModalType.Center",
  Position: "ModalType.Position"
};

export const ModalTypePropType = PropTypes.oneOf([
  ModalType.Full,
  ModalType.Center,
  ModalType.Position
]);
