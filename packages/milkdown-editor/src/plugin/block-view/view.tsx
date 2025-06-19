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

  const createBlockProvider = (editor: any) => {
    const div = ref.current;
    const blockProvider = new BlockProvider({
      ctx: editor.ctx,
      content: div,
      getPlacement: () => 'left',
      getOffset: () => 18,
    });
    tooltipProvider.current = blockProvider;
    tooltipProvider.current?.update();
  };
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

  // useEffect(() => {
  //   const editor = get();
  //   if (editor) {
  //     const smbvApi: any = editor.ctx.get(smBlockViewApi.key);
  //     console.log(smbvApi);
  //   }
  // }, []);

  useClickAway(() => {
    const editor = get();
    if (!editor || !tooltipProvider.current) return;
    // const service = editor.ctx.get(blockServiceInstance.key);
    // service.
    tooltipProvider.current.destroy();
    createBlockProvider(editor);
  }, ref);

  const onClick = () => {
    // const editor = get();
    // if (!editor) return;
    // const smbvApi: any = editor.ctx.get(smBlockViewApi.key);
    // smbvApi.show();
    // console.log(11222, tooltipProvider.current);
    // tooltipProvider.current?.destroy();

    const editor = get();
    if (!editor || !ref.current) return;
    const smbvApi: any = editor.ctx.get(smBlockViewApi.key);
    smbvApi.show();

    const service = editor.ctx.get(blockServiceInstance.key);
    service.unBind();

    // service.bind = service.bind;

    // setTimeout(() => {
    //   service.bind(editor.ctx, (message) => {
    //     console.log(message);
    //   });
    //   // createBlockProvider(editor);
    // }, 3000);

    // tooltipProvider.current?.update();
    // service.removeEvent(ref.current);
    // console.log(111, ref.current);

    // if (smbvApi.onClose) {
    //   smbvApi.onClose(() => {
    //     restoreAllMouseEvents(ref.current);
    //   });
    // }
  };

  return (
    <div ref={ref} className="milkdown-block-handle">
      <img src={block} alt="block" onClick={onClick} />
    </div>
  );
};
