import { Button, Tooltip } from 'antd';
import { RiSave3Line } from '@remixicon/react';

const buttonGroup: Array<any> = [
  {
    value: 'lineSolid',
    label: 'LineSolid',
    icon: RiSave3Line,
    style: { width: 20 },
    action: (editor, handlers) => {
      if(!handlers.onSave){return false};
      let html = editor.getHTML();
      const json = editor.getJSON();
      // 清除空段落
      if(json.content.length === 1 ){
        const firstNode = json.content[0];
        if(firstNode.type === 'paragraph' && !firstNode.content){
          delete json.content;
          html = '';
        }
      }
      handlers.onSave({html, json});
    },
    tooltip: '保存',
  },
];

const FontStyle = ({ editor, handlers }) => {
  return (
    <div className="fontStyle">
      {buttonGroup.map(({ icon: Icon, tooltip, action, value, style }) => (
        <Tooltip title={tooltip} key={value}>
          <Button
            onClick={() => action(editor, handlers)}
            color="default"
            variant="filled"
            autoInsertSpace
          >
            <Icon style={style} />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default FontStyle;
