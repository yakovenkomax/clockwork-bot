import { scheduleCall } from 'scheduleCall';

export const scheduleDailyCall = (callback: () => void, time: string) => {
  let timeoutId: number;

  timeoutId = scheduleCall(() => {
    callback();

    const getTimeoutId = scheduleDailyCall(callback, time);

    timeoutId = getTimeoutId();
  }, time);

  return () => timeoutId
}
