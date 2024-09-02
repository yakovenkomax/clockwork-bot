export const getLocalDate = (date?: Date) => {
  const currentDate = date || new Date();
  const timeZoneOffset = currentDate.getTimezoneOffset();

  if (timeZoneOffset !== 0) {
    currentDate.setMinutes(currentDate.getMinutes() - timeZoneOffset);
  }

  return currentDate;
};
