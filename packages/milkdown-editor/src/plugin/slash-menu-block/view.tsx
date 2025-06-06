import { $ctx } from '@milkdown/kit/utils';
import { useInstance } from '@milkdown/react';
import { useEffect, useRef, useState } from 'react';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { commandsCtx } from '@milkdown/kit/core';
import { paragraphSchema } from '@milkdown/kit/preset/commonmark';
import { TextSelection } from '@milkdown/kit/prose/state';

// $ctx是创建slice 的简单封装
export const slashBlockApi: any = $ctx(
  {
    // 这里初始化参数，要是函数，其实意义不大
    show: () => {},
    hide: () => {},
  },
  'menuAPICtx',
);

export const SlashView = () => {
  const [loading, getEditor] = useInstance();
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
      trigger: '',
      floatingUIOptions: {
        strategy: 'fixed',
      },
    });
    return () => {
      provider.current?.destroy();
      provider.current = null;
      containerRef.current?.remove();
    };
  }, [view]);

  useEffect(() => provider.current?.update(view, prevState));

  const show = () => {
    console.log('show');

    if (!view || !containerRef.current) return;
    const { state } = view;
    const { selection } = state;
    const { $anchor } = selection;
    const pos = view.coordsAtPos($anchor.pos);
    containerRef.current.style.top = `${pos.top + 30}px`;
    containerRef.current.style.left = `${pos.left - 40}px`;
    provider.current?.show();
  };
  const hide = () => {
    console.log('hide');
    provider.current?.hide();
  };

  useEffect(() => {
    if (!editor) return;
    editor.use(slashBlockApi);
    editor.ctx.set(slashBlockApi.key, {
      show: () => show(),
      hide: () => hide(),
    });
  }, [loading]);

  const onDelete = () => {
    if (!editor) return;
    editor.action((ctx) => {
      const { state } = view;
      const { selection } = state;
      const { $anchor } = selection;
      const pos = $anchor.pos;
      const node = state.doc.nodeAt(pos);
      if (!node) return;

      // 获取当前节点的起始位置和结束位置
      const start = pos - $anchor.parentOffset;
      const end = start + node.nodeSize;

      console.log(start, end);
      
      
      // 删除当前节点
      const tr = state.tr.delete(start, end);
      view.dispatch(tr);
      
      // 隐藏菜单
      hide();
    });
  };


  const onInsertHeading1 = () => {
    if (!editor) return;
    editor.action((ctx) => {
      const { state } = view;
      const { selection } = state;
      const { $anchor } = selection;
      const pos = $anchor.pos;
      const node = state.doc.nodeAt(pos);
      if (!node) return;

      // 在下一行插入标题1
      const tr = state.tr.insert(pos + node.nodeSize, state.schema.nodes.heading.create({ level: 1 }));
      // const tr = state.tr.insert(pos + node.nodeSize, state.schema.nodes.heading.create({ level: 1 }, state.schema.text(' ')));
      
      // 将光标移动到新插入的标题1的文本节点中
      const newPos = pos + node.nodeSize + 1;
      tr.setSelection(TextSelection.near(tr.doc.resolve(newPos)));
      
      view.dispatch(tr.scrollIntoView());
      view.focus()
      
      // 隐藏菜单
      hide();
    });
  };

  return (
    <div className="slash-view" ref={containerRef}>
      <div className="slash-view-content">
        <div className="slash-view-content-item" onClick={onDelete}>
          删除
        </div>
        <div className="slash-view-content-item" onClick={onInsertHeading1}>
          插入标题1
        </div>
      </div>
    </div>
  );
};
