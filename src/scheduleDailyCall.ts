import { scheduleCall } from 'scheduleCall';

export const scheduleDailyCall = <Args>(callback: (args: Args) => Promise<void>, getArgs: () => Args, time: string) => {
  let timeoutId: number;

  const args = getArgs();

  timeoutId = scheduleCall(async () => {
    await callback(args);

    const getTimeoutId = scheduleDailyCall(callback, getArgs, time);

    timeoutId = getTimeoutId();
  }, time);

  return () => timeoutId;
};
