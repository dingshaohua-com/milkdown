import { useClickAway } from 'ahooks';
import { useEffect, useRef } from 'react';
import { useInstance } from '@milkdown/react';
import block from '../../assets/img/block.svg';
import { api as smBlockViewApi } from '../slash-menu-block-view';
import { BlockProvider, blockServiceInstance, blockConfig } from '@milkdown/kit/plugin/block';

export const View = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);

  const [loading, get] = useInstance();

  // const createBlockProvider = (editor: any) => {
  //   const div = ref.current as HTMLElement;
  //   const blockProvider = new BlockProvider({
  //     ctx: editor.ctx,
  //     content: div,
  //     getPlacement: () => 'left',
  //     getOffset: () => 18,
  //   });
  //   tooltipProvider.current = blockProvider;
  //   tooltipProvider.current?.update();
  // };
  useEffect(() => {
    const div = ref.current;
    if (loading || !div) return;

    const editor = get();
    if (!editor) return;

    const blockProvider = new BlockProvider({
      ctx: editor.ctx,
      content: div,
      getPlacement: () => 'left',
      getOffset: () => 18,
    });
    tooltipProvider.current = blockProvider;

    // console.log(service.removeEvent());

    tooltipProvider.current?.update();
    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  const editor = get()!;
  const smbvApi: any = editor.ctx.get(smBlockViewApi.key);
  useClickAway(() => {
    if (!editor || !tooltipProvider.current) return;
    const service = editor.ctx.get(blockServiceInstance.key);
    service.bind(editor.ctx, (message) => {
      if (message.type === 'hide') {
        tooltipProvider.current.hide();
        // this.#activeNode = null;
      } else if (message.type === 'show') {
        tooltipProvider.current.show(message.active);
        // this.#activeNode = message.active;
      }
    });
  }, [smbvApi?.ref, ref]);

  const onClick = (e: React.MouseEvent<HTMLImageElement>) => {
    var x = e.clientX;
    var y = e.clientY;
    const editor = get();
    if (!editor || !ref.current) return;
    const smbvApi: any = editor.ctx.get(smBlockViewApi.key);
    smbvApi.show(x,y);
    const service = editor.ctx.get(blockServiceInstance.key);
    service.unBind();
  };

  return (
    <div ref={ref} className="milkdown-block-handle">
      <img src={block} alt="block" onClick={onClick} />
    </div>
  );
};
