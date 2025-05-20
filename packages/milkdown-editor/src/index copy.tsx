import './style.scss';
import { useState } from 'react';
import MenuBar from './menu-bar';
import emitter from './utils/emitter';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/frame.css'; // 一个完整主题（可选，其它可选项见下）
import '@milkdown/crepe/theme/common/style.css'; // 基础样式（必需）
import { replaceAll } from '@milkdown/kit/utils';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';

const CrepeEditor: React.FC<{ defaultValue: string }> = ({ defaultValue }) => {
  const [content, setContent] = useState(defaultValue || 'Hello, Milkdown!');
  const { get } = useEditor((root) => {
    const crepe = new Crepe({ root, defaultValue: content });
    crepe.on((listener) => {
      listener.selectionUpdated((ctx, selection, prevSelection) => {
        emitter.emit('selectionUpdated', { ctx, selection, prevSelection });
      });
      listener.markdownUpdated((ctx, markdown) => {
        setContent(markdown);
      });
    });
    return crepe;
  });

  const editor = get();
  const onContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    editor.action(replaceAll(e.target.innerText));
  };

  return (
    <div className="milkdown-editor">
      <MenuBar editor={editor} />
      <div className="milkdown-editor-content">
        <Milkdown />
        <div contentEditable={true} onInput={(e) => onContentChange(e)} dangerouslySetInnerHTML={{ __html: content }}>
        </div>
      </div>
    </div>
  );
};

export const MilkdownEditorWrapper: React.FC = (props) => {
  return (
    <MilkdownProvider>
      <CrepeEditor {...props} />
    </MilkdownProvider>
  );
};

export default MilkdownEditorWrapper;
