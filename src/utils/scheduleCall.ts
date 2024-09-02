import { getLocalDate } from 'utils/getLocalDate';

export const scheduleCall = (callback: Function, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const currentDate = getLocalDate();
  const scheduledDate = getLocalDate(new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hours,
    minutes,
  ));

  if (scheduledDate <= currentDate) {
    scheduledDate.setDate(currentDate.getDate() + 1);
  }

  const timeDifference = scheduledDate.getTime() - currentDate.getTime();
  const hoursDifference = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
  const minutesDifference = Math.floor((timeDifference / 1000 / 60) % 60);

  console.log('Scheduled in:', hoursDifference, 'hours', minutesDifference, 'minutes.');

  const timeoutId = setTimeout(callback, timeDifference);

  return timeoutId;
};
