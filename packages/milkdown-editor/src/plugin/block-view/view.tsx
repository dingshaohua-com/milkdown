import { useEffect, useRef } from 'react';
import block from '../../assets/block.svg';
import { useInstance } from '@milkdown/react';
import { slashBlockApi } from '../slash-menu-block/view';
import { BlockProvider } from '@milkdown/kit/plugin/block';
import { usePluginViewContext } from '@prosemirror-adapter/react';

export const BlockView = (props: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);
  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const editor = get();

  useEffect(() => {
    const div = ref.current;
    if (loading || !div || !editor) return;
    tooltipProvider.current = new BlockProvider({
      ctx: editor.ctx,
      content: div,
      getOffset: () => 10,
      getPlacement: () => 'left',
    });
    tooltipProvider.current?.update();
    return () => {
      tooltipProvider.current?.destroy();
      div.remove();
    };
  }, [loading]);

  const onClickBlock = () => {
    const editor = get();
    if (!editor) return;
    const sbApi: any = editor.ctx.get(slashBlockApi.key);
    sbApi.show();
  };

  return (
    <div>
      <div ref={ref} className="block-view">
        <div className="block-view-container">
          <img src={block} alt="block" onClick={onClickBlock} />
        </div>
      </div>
    </div>
  );
};
