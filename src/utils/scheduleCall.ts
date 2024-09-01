export const scheduleCall = (callback: Function, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const currentDate = new Date();
  const scheduledDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hours,
    minutes
  );

  if (scheduledDate <= currentDate) {
    scheduledDate.setDate(currentDate.getDate() + 1);
  }

  const timeDifference = scheduledDate.getTime() - currentDate.getTime();

  const timeoutId = setTimeout(callback, timeDifference);

  return timeoutId;
}
