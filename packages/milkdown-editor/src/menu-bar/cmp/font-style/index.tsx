import { Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import emitter from '../../../utils/emitter';
import type { Editor } from '@milkdown/kit/core';
import { commandsCtx, editorStateCtx, schemaCtx } from '@milkdown/kit/core';
import { useEditorConfig } from '../../../config-ctx';
import { checkMarkActive } from '../../../utils/editor-helper';
import { toggleStrongCommand, toggleEmphasisCommand } from '@milkdown/kit/preset/commonmark';
import { RiBold, RiItalic, RiUnderline, RiStrikethrough, RiEmphasisCn } from '@remixicon/react';
import { toggleMark, setBlockType } from '@milkdown/kit/prose/commands'
import { toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm'


const buttonGroupTemp: Array<any> = [
  {
    value: 'strong',
    label: 'Strong',
    icon: RiBold,
    action: (editor: Editor) => {
      editor.action((ctx) => ctx.get(commandsCtx).call(toggleStrongCommand.key));
    },
    isActive: false,
    tooltip: '粗体',
  },
  {
    value: 'emphasis',
    label: 'Emphasis',
    icon: RiItalic,
    action: (editor: Editor) => {
      editor.action((ctx) => ctx.get(commandsCtx).call(toggleEmphasisCommand.key));
    },
    isActive: false,
    tooltip: '斜体',
  },
  {
    value: 'strike_through',
    label: 'StrikeThrough',
    icon: RiStrikethrough,
    action: (editor: Editor) => {
      editor.action((ctx) => ctx.get(commandsCtx).call(toggleStrikethroughCommand.key));
    },
    isActive: false,
    tooltip: '删除线',
  },
];

const FontStyle = () => {
  const config = useEditorConfig();
  const editor = config.editor as Editor;

  const [buttonGroup, setButtonGroup] = useState(buttonGroupTemp);

  const updateActiveState = (ctx: any, selection: any, prevSelection: any) => {
    buttonGroup.forEach((item) => {
      item.isActive = checkMarkActive(item.value, ctx, selection, prevSelection);
    });
    setButtonGroup([...buttonGroup]);
  };

  useEffect(() => {
    emitter.on('selectionUpdated', (arg: any) => {
      console.log(111222333, arg.selection);
      updateActiveState(arg.ctx, arg.selection, arg.prevSelection);
    });
  }, []);

  return (
    <div className="itemsStyle">
      {buttonGroup.map(({ icon: Icon, tooltip, isActive, action, value }) => (
        <Tooltip title={tooltip} key={value}>
          <Button onClick={() => action(editor)} color="default" variant={isActive ? 'solid' : 'filled'} autoInsertSpace>
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default FontStyle;
