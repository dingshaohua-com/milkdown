import './style.scss';
import MenuBar from './menu-bar';
import MdEditor from './md-editor';
import emitter from './utils/emitter';
import { EditorConfig } from '../global';
// import '@milkdown/crepe/theme/frame.css'; // 一个完整主题（可选，其它可选项见下）
import { useState, useEffect } from 'react';
import { nord } from '@milkdown/theme-nord';
import { useBlock } from './plugin/block-view';
// import '@milkdown/crepe/theme/common/style.css'; // 基础样式（必需）
import { replaceAll } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { useSlashPlus } from './plugin/slash-menu-plus';
import { useSlashBlock } from './plugin/slash-menu-block';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import { install as mblockViewInstall } from './plugin/mblock-view';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react';
import { EditorConfigProvider, useEditorDefaultConfig } from './config-ctx';

const CrepeEditor: React.FC<EditorConfig> = (props) => {
  const pluginViewFactory = usePluginViewFactory();
  const block = useBlock();
  const slashBlock = useSlashBlock();
  const slashPlus = useSlashPlus();
  const defaultConfig = useEditorDefaultConfig();
  const config = { ...defaultConfig, ...props };
  const [mdMode, setMdMode] = useState(config.mdMode || false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMdEditorFocused, setIsMdEditorFocused] = useState(false);
  const [content, setContent] = useState(config.content || 'Hello, Milkdown!');

  // const { get } = useEditor((root) => {
  //   const crepe = new Crepe({
  //     root,
  //     defaultValue: content,
  //     features: {
  //       'block-edit': false,
  //     },
  //   });
  //   crepe.on((listener) => {
  //     listener.selectionUpdated((ctx) => {
  //       const editorViewCtxVal = ctx.get(editorViewCtx);
  //       if (editorViewCtxVal.hasFocus && editorViewCtxVal.hasFocus()) {
  //         emitter.emit('selectionUpdated' as never);
  //       }
  //     });
  //     listener.markdownUpdated((ctx, markdown) => {
  //       const isFocused = ctx.get(editorViewCtx).hasFocus();
  //       if (isFocused) {
  //         setContent(markdown);
  //         config.onChange && config.onChange(markdown);
  //       }
  //     });
  //   });
  //   crepe.editor
  //     .config((ctx: any) => {
  //       slashBlock.config(ctx);
  //     })
  //     .use(slashBlock.plugin);

  //   crepe.editor
  //     .config((ctx: any) => {
  //       slashPlus.config(ctx);
  //     })
  //     .use(slashPlus.plugin);

  //   crepe.editor
  //     .config((ctx: any) => {
  //       block.config(ctx);
  //     })
  //     .use(block.plugin);

  //   return crepe;
  // });

  const { get, loading } = useEditor(
    (root) => {
      const editor = Editor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, content);
        })
        .use(commonmark);
      mblockViewInstall(editor, pluginViewFactory);
      return editor;
    },

    // .then(() => {
    //   console.log("Editor created");
    // })
  );

  const editor = get();

  useEffect(() => {
    if (editor && config.content !== content) {
      editor?.action(replaceAll(config.content || ''));
      setContent(config.content || '');
    }
  }, [config.content]);

  useEffect(() => {
    if (!editor) return;
    const editorView = editor.ctx.get(editorViewCtx);
    editorView.dom.addEventListener('focus', () => setIsFocused(true));
    editorView.dom.addEventListener('blur', () => setIsFocused(false));
    return () => {
      editorView.dom.removeEventListener('focus', () => {});
      editorView.dom.removeEventListener('blur', () => {});
    };
  }, [get]);

  const handleMdEditorChange = (content: string) => {
    setContent(content);
    editor?.action(replaceAll(content));
  };

  return (
    <EditorConfigProvider {...{ ...config, editor, isFocused, isMdEditorFocused, mdMode, setMdMode }}>
      <div className="milkdown-editor">
        {editor && <MenuBar />}
        <div className="content">
          <Milkdown />
          {mdMode && <MdEditor content={content} setIsMdEditorFocused={setIsMdEditorFocused} onChange={handleMdEditorChange} />}
        </div>
      </div>
    </EditorConfigProvider>
  );
};

export const MilkdownEditorWrapper: React.FC<EditorConfig> = (props) => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <CrepeEditor {...props} />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
};

export default MilkdownEditorWrapper;
