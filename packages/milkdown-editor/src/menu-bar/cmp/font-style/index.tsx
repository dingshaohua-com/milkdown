import { Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import emitter from '../../../utils/emitter';
import type { Editor } from '@milkdown/kit/core';
import { useEditorConfig } from '../../../config-ctx';
import { checkMarkActive } from '../../../utils/editor-helper1';
import { toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';
import { toggleMark, setBlockType } from '@milkdown/kit/prose/commands';
import { commandsCtx, editorStateCtx, schemaCtx } from '@milkdown/kit/core';
import { toggleStrongCommand, toggleEmphasisCommand } from '@milkdown/kit/preset/commonmark';
import { RiBold, RiItalic, RiUnderline, RiStrikethrough, RiEmphasisCn } from '@remixicon/react';

const buttonGroup: Array<any> = [
  {
    id: 'strong',
    icon: RiBold,
    action: (editor: Editor) => editor.action((ctx) => ctx.get(commandsCtx).call(toggleStrongCommand.key)),
    isActive: (editor: Editor) => checkMarkActive('strong', editor),
    tooltip: '粗体',
  },
  {
    id: 'emphasis',
    icon: RiItalic,
    action: (editor: Editor) => editor.action((ctx) => ctx.get(commandsCtx).call(toggleEmphasisCommand.key)),
    isActive:(editor: Editor) => checkMarkActive('emphasis', editor),
    tooltip: '斜体',
  },
  {
    id: 'strike_through',
    icon: RiStrikethrough,
    action: (editor: Editor) => editor.action((ctx) => ctx.get(commandsCtx).call(toggleStrikethroughCommand.key)),
    isActive: (editor: Editor) => checkMarkActive('strike_through', editor),
    tooltip: '删除线',
  },
];

const FontStyle = () => {
  const config = useEditorConfig();
  const editor = config.editor as Editor;

  const [, forceUpdate] = useState({});
  useEffect(() => emitter.on('selectionUpdated', () => forceUpdate({})), []);

  return (
    <div className="group">
      {buttonGroup.map(({ icon: Icon, tooltip, isActive, action, id }) => (
        <Tooltip title={tooltip} key={id}>
          <Button onClick={() => action(editor)} color="default" variant={isActive(editor) ? 'solid' : 'filled'} autoInsertSpace>
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default FontStyle;
