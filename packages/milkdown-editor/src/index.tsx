import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/frame.css'; // 一个完整主题（可选，其它可选项见下）
import '@milkdown/crepe/theme/common/style.css'; // 基础样式（必需）
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';

const CrepeEditor: React.FC = () => {
  const { get } = useEditor((root) => {
    const crepe = new Crepe({ root, defaultValue: 'Hello, Milkdown!' });
    crepe.on((listener) => {
      listener.updated((ctx, doc, prevDoc) => {
        console.log(123);
      });
    });
    return crepe;
  });

  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC = () => {
  return (
    <MilkdownProvider>
      <CrepeEditor />
    </MilkdownProvider>
  );
};

export default MilkdownEditorWrapper;
