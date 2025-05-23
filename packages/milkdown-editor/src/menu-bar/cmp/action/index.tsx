import { Button, Tooltip } from 'antd';
import { EditorConfig } from '../../../../global';
import { useEditorConfig } from '../../../config-ctx';
import { RiMarkdownLine, RiSave3Line } from '@remixicon/react';
import { Editor, editorViewCtx, serializerCtx } from '@milkdown/kit/core';

const buttonGroup: Array<any> = [
  {
    id: 'md',
    icon: RiMarkdownLine,
    isActive: (config: EditorConfig) => config.mdMode,
    action: (config: EditorConfig) =>  config.setMdMode(!config.mdMode),
    tooltip: 'MD模式',
  },
  {
    id: 'save',
    icon: RiSave3Line,
    isActive:()=>false,
    action: (editor: Editor, config: EditorConfig) => {
      editor.action((ctx) => {
        const editorView = ctx.get(editorViewCtx);
        const serializer = ctx.get(serializerCtx);
        const res = serializer(editorView.state.doc);
        config.onSave &&
          config.onSave({
            doc: editorView.state.doc,
            json: editorView.state.doc.toJSON(),
            markdown: res,
          });
      });
    },
    tooltip: '保存',
  },
];

const Action = () => {
  const config = useEditorConfig();
  const editor = config.editor as Editor;

  return (
    <div className="group">
      {buttonGroup.map(({ icon: Icon, tooltip, action, id, style, isActive }) => (
        <Tooltip title={tooltip} key={id}>
          <Button onClick={() => action(config)} color="default" variant={isActive(config) ? 'solid' : 'filled'} autoInsertSpace>
            <Icon style={style} /> {}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default Action;
