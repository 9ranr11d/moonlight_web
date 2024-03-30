/** mm:ss형식으로 변경 */
export const convertToMinutes = (time: number): string => {
  const minute = Math.floor(time / 60);
  const second = time % 60;

  const paddedMinutes = String(minute).padStart(2, "0");
  const paddedSecond = String(second).padStart(2, "0");

  return `${paddedMinutes}:${paddedSecond}`;
};
