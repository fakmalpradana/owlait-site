import { Doc } from '@/pages/Doc';
import { mount } from '@/mount';

mount((root) => <Doc slug={root.dataset.doc ?? ''} />);
