import MenuBar from './menu-bar';
import '../assets/css/style.scss';
import MdEditor from './md-editor';
import emitter from '../utils/emitter';
// import '@milkdown/crepe/theme/frame.css'; // 一个完整主题（可选，其它可选项见下）
import { useState, useEffect } from 'react';
import { EditorConfig } from '../../global';
import { nord } from '@milkdown/theme-nord';
import { gfm } from '@milkdown/kit/preset/gfm';
// import '@milkdown/crepe/theme/common/style.css'; // 基础样式（必需）
import { replaceAll } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { tableBlock } from '@milkdown/kit/component/table-block';
// import '@milkdown/theme-nord/style.css'
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import { install as blockViewInstall } from '../plugin/block-view';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react';
import { EditorConfigProvider, useEditorDefaultConfig } from '../utils/config-ctx';
import { install as slashMenuSelectionInstall } from '../plugin/slash-menu-selection';
import { install as slashMenuBlockViewInstall } from '../plugin/slash-menu-block-view';

const MyEditor: React.FC<EditorConfig> = (props) => {
  const pluginViewFactory = usePluginViewFactory();
  const config = { ...useEditorDefaultConfig(), ...props };
  const [mdMode, setMdMode] = useState(config.mdMode || false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMdEditorFocused, setIsMdEditorFocused] = useState(false);
  const [content, setContent] = useState(config.content || '');

  const { get, loading } = useEditor((root) => {
    const editor = Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, content);
        ctx
          .get(listenerCtx)
          .markdownUpdated((ctx, markdown) => {
            const isFocused = ctx.get(editorViewCtx).hasFocus();
            if (isFocused) {
              setContent(markdown);
              config.onChange && config.onChange(markdown);
            }
          })
          .selectionUpdated((ctx) => {
            const editorViewCtxVal = ctx.get(editorViewCtx);
            if (editorViewCtxVal.hasFocus && editorViewCtxVal.hasFocus()) {
              emitter.emit('selectionUpdated' as never);
            }
          });
      })
      .use(listener)
      .use(commonmark)
      .use(gfm) // table 配套
      .use(tableBlock); // table 配套
    blockViewInstall(editor, pluginViewFactory);
    slashMenuBlockViewInstall(editor, pluginViewFactory);
    slashMenuSelectionInstall(editor, pluginViewFactory);
    return editor;
  });

  const editor = get();

  useEffect(() => {
    if (config.content !== content) {
      editor?.action(replaceAll(config.content || ''));
      setContent(config.content || '');
    }
  }, [config.content]);

  useEffect(() => {
    if (loading || !editor) return;
    const editorView = editor.ctx.get(editorViewCtx);
    editorView.dom.addEventListener('focus', () => setIsFocused(true));
    editorView.dom.addEventListener('blur', () => setIsFocused(false));
    return () => {
      editorView.dom.removeEventListener('focus', () => {});
      editorView.dom.removeEventListener('blur', () => {});
    };
  }, [loading]);

  const handleMdEditorChange = (content: string) => {
    setContent(content);
    editor?.action(replaceAll(content));
  };

  return (
    <EditorConfigProvider {...{ ...config, editor, isFocused, isMdEditorFocused, mdMode, setMdMode }}>
      <div className="my-editor">
        {editor && <MenuBar />}
        <div className="content">
          <Milkdown />
          {mdMode && <MdEditor content={content} setIsMdEditorFocused={setIsMdEditorFocused} onChange={handleMdEditorChange} />}
        </div>
      </div>
    </EditorConfigProvider>
  );
};

export default (props: EditorConfig) => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MyEditor {...props} />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
};
