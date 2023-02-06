import { ShapeTypeKeys } from '@/types';
import { DivHandler } from './DivHandler';
import { LineHandler } from './LineHandler';
import { SphereHandler } from './SphereHandler';

const Hanlders = new Map<ShapeTypeKeys, React.FunctionComponent>();
Hanlders.set('line', LineHandler);
Hanlders.set('box', DivHandler);
Hanlders.set('sphere', SphereHandler);

export { Hanlders };
