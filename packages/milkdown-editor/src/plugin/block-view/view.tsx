// import { slash } from '../slash-menu';
import plus from '../../assets/plus.svg';
import { useEffect, useRef } from 'react';
import block from '../../assets/block.svg';
import { useInstance } from '@milkdown/react';
import { BlockProvider } from '@milkdown/kit/plugin/block';
import { usePluginViewContext } from '@prosemirror-adapter/react';

export const BlockView = (props: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);
  const all = usePluginViewContext();
  const { view, prevState } = all;
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

  return (
    <div ref={ref} className="block-view">
      <div className="block-view-container">
        <img src={plus} alt="plus" />
        <img src={block} alt="block" />
      </div>
    </div>
  );
};
