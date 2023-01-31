import { DivHandler } from './DivHandler';
import { LineHandler } from './LineHandler';
import { SphereHandler } from './SphereHandler';

const Hanlders = new Map<string, React.FunctionComponent>();
Hanlders.set('line', LineHandler);
Hanlders.set('div', DivHandler);
Hanlders.set('sphere', SphereHandler);

export { Hanlders };
