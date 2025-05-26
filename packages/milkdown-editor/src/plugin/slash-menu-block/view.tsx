import { $ctx } from '@milkdown/kit/utils';
import { useInstance } from '@milkdown/react';
import { useEffect, useRef, useState } from 'react';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import { usePluginViewContext } from '@prosemirror-adapter/react';


// $ctx是创建slice 的简单封装
export const slashBlockApi:any = $ctx(
  { // 这里初始化参数，其实意义不大
    show: () => {},
    hide: () => {},
  },
  'menuAPICtx'
);

export const SlashView = () => {
  const instance = useInstance();
  const [loading, getEditor] = instance;
  const editor = getEditor()!;
  const { view, prevState } = usePluginViewContext();
  const provider = useRef<SlashProvider>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current || !view) return;
    provider.current = new SlashProvider({
      content: containerRef.current,
      debounce: 50,
      offset: 10,
      floatingUIOptions: {
        placement: 'left',
      }
    });
    return () => {
      provider.current?.destroy();
      provider.current = null;
      containerRef.current?.remove();
    };
  }, [view]);
  useEffect(() => provider.current?.update(view, prevState));

  const show = () => {
    provider.current?.show();
  };
  const hide = () => {
    provider.current?.hide();
  };

  useEffect(() => {
    if (!editor) return;
    editor.use(slashBlockApi);
    editor.ctx.set(slashBlockApi.key, {
      show: () => show(),
      hide: () => hide(),
    })
    
  }, [loading]);

  return (
    <div className="slash-view" ref={containerRef}>
      <div className="slash-view-content">
        <div className="slash-view-content-item">
         删除
        </div>
      </div>
    </div>
  );
};
