import { RiMenu2Fill, RiMenu5Line, RiMenu3Line } from '@remixicon/react';
import './style.scss';
import { Button, Tooltip } from 'antd';

const buttonGroup: Array<any> = [
  {
    value: 'alignLeft',
    label: 'AlignLeft',
    icon: RiMenu2Fill,
    action: (editor) => editor.chain().focus().toggleTextAlign('left').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'left' }),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleTextAlign('left').run() &&
      !editor.isActive('codeBlock'),
    tooltip: '居左',
  },

  {
    value: 'alignCenter',
    label: 'AlignCenter',
    icon: RiMenu3Line,
    action: (editor) => editor.chain().focus().toggleTextAlign('center').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleTextAlign('center').run() &&
      !editor.isActive('codeBlock'),
    tooltip: '居中',
  },
  {
    value: 'alignRight',
    label: 'AlignRight',
    icon: RiMenu5Line,
    action: (editor) => editor.chain().focus().toggleTextAlign('right').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleTextAlign('right').run() &&
      !editor.isActive('codeBlock'),
    tooltip: '居右',
  },
];

const FontStyle = ({ editor }) => {
  return (
    <div className="fontStyle">
      {buttonGroup.map(({ icon: Icon, tooltip, isActive, action, value }) => (
        <Tooltip title={tooltip} key={value}>
          <Button
            onClick={() => action(editor)}
            color="default"
            variant={isActive(editor) ? 'solid' : 'filled'}
            autoInsertSpace
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default FontStyle;
