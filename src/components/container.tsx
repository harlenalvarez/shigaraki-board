import { useEffect, useRef } from 'react';
import { Canvas } from './Canvas';
import styles from './Container.module.css';
import { Main } from './Main';

// container is composed of 3 sections, main action buttons, popover actions and canvas
export const Container = () => {

  const mainRef = useRef<HTMLDivElement>(null)
  const keepInView = (ev: Event) => {
    if (!mainRef || !mainRef.current) return;
    const element = ev.currentTarget as Document;
    const bodyDimensions = element.body.getBoundingClientRect();

    mainRef.current.style.top = `${0 - bodyDimensions.top}px`;
    mainRef.current.style.left = `${0 - bodyDimensions.left}px`;

  }
  useEffect(() => {
    document.addEventListener('scroll', keepInView);
    return () => {
      document.removeEventListener('scroll', keepInView);
    }
  }, [])
  return (
    <>
      <section id='main' className={styles.main} tabIndex={1} ref={mainRef}>
        <Main />
      </section>
      <section id='popover' className={styles.popover} tabIndex={1} />
      <section id='canvas' className={styles.canvas} tabIndex={0}>
        <Canvas />
      </section>
      <section id='hidden-canvas' className={styles.hidden} tabIndex={0} aria-hidden='true'></section>
    </>
  );
};
