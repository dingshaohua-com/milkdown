import View from './view';
import { $ctx } from '@milkdown/kit/utils';
import { tooltipFactory } from '@milkdown/kit/plugin/tooltip'

export const tooltip = tooltipFactory('selection');
// $ctx是创建slice 的简单封装
// export const api: any = $ctx(
//   {
//     // 这里初始化参数，要是函数，其实意义不大
//     show: () => {},
//     hide: () => {},
//   },
//   'smBlockViewApi',
// );

export const api: any = $ctx(null,'smBlockViewApi');

export const install = (editor: any, pluginViewFactory: any) => {
  editor
    .config((ctx: any) => {
      // ctx.set(api.key, {
      //   show: () => {},
      //   hide: () => {}
      // });
      ctx.set(tooltip.key, {
        view: pluginViewFactory({
          component: View,
        }),
      });
    })
    .use(api)
    .use(tooltip);
};
