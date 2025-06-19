import { useEffect, useRef } from 'react';
import { useInstance } from '@milkdown/react';
import block from '../../assets/img/block.svg';
import { BlockProvider } from '@milkdown/kit/plugin/block';
import { api as smBlockViewApi } from '../slash-menu-block-view';

export const View = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);

  const [loading, get] = useInstance();

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) return;

    const editor = get();
    if (!editor) return;

    tooltipProvider.current = new BlockProvider({
      ctx: editor.ctx,
      content: div,
      getPlacement: () => 'left',
      getOffset: () => 18,
    });
    tooltipProvider.current?.update();

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  const onClick = () => {
    const editor = get();
    if (!editor) return;
    const smbvApi: any = editor.ctx.get(smBlockViewApi.key);
    smbvApi.show();
  };

  return (
    <div ref={ref} className="milkdown-block-handle">
      <img src={block} alt="block" onClick={onClick} />
    </div>
  );
};
