import { Button, Tooltip } from 'antd';
import { RiMarkdownLine, RiSave3Line } from '@remixicon/react';

const buttonGroup: Array<any> = [
  {
    id: 'md',
    icon: RiMarkdownLine,
    action: () => {
      
    },
    tooltip: 'MD模式',
  },
  {
    id: 'save',
    icon: RiSave3Line,
    action: () => {
      
    },
    tooltip: '保存',
  },
];

const FontStyle = () => {
  return (
    <div className="itemsStyle">
      {buttonGroup.map(({ icon: Icon, tooltip, action,id, style }) => (
        <Tooltip title={tooltip} key={id}>
          <Button
            onClick={() => action()}
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
