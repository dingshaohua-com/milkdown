import { View } from './view';
import { block } from '@milkdown/kit/plugin/block';

export const install = (editor: any, pluginViewFactory: any) => {
  editor
    .config((ctx: any) => {
      ctx.set(block.key, {
        view: pluginViewFactory({
          component: View,
        }),
      });
    })
    .use(block);
};