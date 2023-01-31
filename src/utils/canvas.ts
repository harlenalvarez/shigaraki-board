export const getClickedPoint = (e: { clientX: number, clientY: number }, canvas?: HTMLCanvasElement): [number, number] => {
  if (canvas == null) throw new Error('Canvas argument is undefined');
  const { left, top } = canvas.getBoundingClientRect();
  return [
    e.clientX - left,
    e.clientY - top
  ];
};