// ohh safari of course you don't support OffscreenCanvas, I see you're taking IEs spot
addEventListener('message', (ev) => {
  console.log(ev.data);
  const offline = new OffscreenCanvas(1600, 1600);
  const ctx = offline.getContext('2d') as OffscreenCanvasRenderingContext2D;
  if (!ctx) {
    console.error('Offline not available');
    return;
  }
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 150, 100);
});

export { };
