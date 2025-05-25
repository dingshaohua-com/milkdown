import { useEffect, useRef } from 'react';
import { useInstance } from '@milkdown/react';
import { editorViewCtx } from '@milkdown/kit/core';
import { TextSelection } from '@milkdown/kit/prose/state';
import { slashFactory } from '@milkdown/kit/plugin/slash';
import { BlockProvider } from '@milkdown/kit/plugin/block';
import { usePluginViewContext } from '@prosemirror-adapter/react';

const menuAPI = slashFactory('slashMenu');

export const BlockView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);
  const { view, prevState } = usePluginViewContext();

  const [loading, get] = useInstance();

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) return;

    const editor = get();
    if (!editor) return;

    tooltipProvider.current = new BlockProvider({
      ctx: editor.ctx,
      content: div,
      getOffset: () => 16,
      getPlacement: ({ active, blockDom }) => {
        if (active.node.type.name === 'heading') return 'left';
        return 'left';
      },
    });
    tooltipProvider.current?.update();

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    if (view && prevState) {
      tooltipProvider.current?.update();
    }
  }, [view, prevState]);

  const onClick = () => {
    const editor = get();
    if (!editor) return;

    const active = tooltipProvider.current?.active;
    if (!active) return;

    const editorView = editor.ctx.get(editorViewCtx);
    const pos = active.$pos.pos;
    const tr = editorView.state.tr.setSelection(TextSelection.near(editorView.state.doc.resolve(pos)));
    editorView.dispatch(tr.scrollIntoView());

    editor.ctx.get(menuAPI.key).show(pos);
  };

  return (
    <div ref={ref} className="block-view">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={onClick}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
      </svg>
    </div>
  );
};
