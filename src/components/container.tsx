import { Canvas } from './Canvas';
import styles from './Container.module.css';
import { Main } from './Main';

// container is composed of 3 sections, main action buttons, popover actions and canvas
export const Container = () => {
  return (
    <>
      <section id='main' className={styles.main} tabIndex={1}>
        <Main />
      </section>
      <section id='popover' className={styles.popover} tabIndex={1}>

      </section>
      <section id='canvas' className={styles.canvas} tabIndex={0}>
        <Canvas />
      </section>
    </>
  );
};
