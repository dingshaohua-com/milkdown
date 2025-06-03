import { View } from './view';
import { block } from '@milkdown/kit/plugin/block';
import { BlockProvider } from '@milkdown/kit/plugin/block';

export const install = (editor: any, pluginViewFactory: any) => {
  console.log(111, editor);
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

// function createBlockPluginView(ctx) {
//   return (view) => {
//     const content = document.createElement('div');

//     const provider = new BlockProvider({
//       ctx,
//       content: this.content,
//     });

//     return {
//       update: (updatedView, prevState) => {
//         provider.update(updatedView, prevState);
//       },
//       destroy: () => {
//         provider.destroy();
//         content.remove();
//       },
//     };
//   };
// }
