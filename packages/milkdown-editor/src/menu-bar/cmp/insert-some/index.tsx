import { Button, Tooltip } from 'antd';
import Solid from '../../../assets/solid.svg';
import Dashed from '../../../assets/dashed.svg';

const buttonGroup: Array<any> = [
  {
    value: 'lineSolid',
    label: 'LineSolid',
    icon: Solid,
    action: (editor) => editor.chain().focus().insertHr().run(),
    tooltip: '下划线-细线',
  },
  {
    value: 'lineDashed',
    label: 'LineDashed',
    icon: Dashed,
    action: (editor) => editor.chain().focus().insertHr('dashed').run(),
    tooltip: '下划线-虚线',
  },
];

const FontStyle = ({ editor }) => {
  return (
    <div className="fontStyle">
      {buttonGroup.map(({ icon: Icon, tooltip, action, value }) => (
        <Tooltip title={tooltip} key={value}>
          <Button
            onClick={() => action(editor)}
            color="default"
            variant='filled'
            autoInsertSpace
          >
            <img src={Icon}/>
          </Button>
        </Tooltip>  
      ))}
    </div>
  );
};

export default FontStyle;
