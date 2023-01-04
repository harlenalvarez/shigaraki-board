import { DivHandler } from './DivHandler';
import { LineHandler } from './LineHandler';

const Hanlders = new Map<string, React.FC>();
Hanlders.set('line', LineHandler);
Hanlders.set('div', DivHandler);

export { Hanlders };
