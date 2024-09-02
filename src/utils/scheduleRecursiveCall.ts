import { scheduleCall } from 'utils/scheduleCall';

export const scheduleRecursiveCall = async <Args>(callback: (args: Args) => Promise<void>, getArgs: () => Promise<Args>, time: string) => {
  let timeoutId: number;

  const args = await getArgs();

  timeoutId = scheduleCall(async () => {
    await callback(args);

    const getTimeoutId = await scheduleRecursiveCall(callback, getArgs, time);

    timeoutId = getTimeoutId();
  }, time);

  return () => timeoutId;
};
