import View from './view';
import { $ctx } from '@milkdown/kit/utils';
import { slashFactory } from '@milkdown/kit/plugin/slash';

export const slash = slashFactory('Commands');
// $ctx是创建slice 的简单封装
export const api: any = $ctx(
  {
    // 这里初始化参数，要是函数，其实意义不大
    show: () => {},
    hide: () => {},
  },
  'smBlockViewApi',
);

export const install = (editor: any, pluginViewFactory: any) => {
  editor
    .config((ctx: any) => {
      ctx.set(api.key, {
        show: () => {},
        hide: () => {}
      });
      ctx.set(slash.key, {
        view: pluginViewFactory({
          component: View,
        }),
      });
    })
    .use(api)
    .use(slash);
};
