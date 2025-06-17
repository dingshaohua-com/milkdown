import './style.scss';
import { Select } from 'antd';

const Heading = ({ editor }) => {
  const onChange = (level: Number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const options = [
    {
      label: '正文',
      value: 0,
    },
    {
      label: <span className="h1">标题 1</span>,
      value: 1,
    },
    {
      label: <span className="h2">标题 2</span>,
      value: 2,
    },
    {
      label: <span className="h3">标题 3</span>,
      value: 3,
    },
  ];

  /**
   * 获取当前激活的标题或段落的级别
   *
   * @returns 如果当前激活的节点是标题或段落，则返回其级别；否则返回undefined
   */
  const getActiveLeave = () => {
    if (editor.isActive('paragraph')) return 0;
    for (const { value: level } of options) {
      if (editor.isActive('heading', { level })) return level;
    }
  };
  const activeLeave = getActiveLeave();
  return (
    <Select
      getPopupContainer={trigger => trigger.parentNode}
      value={activeLeave || 0}
      style={{ width: 88 }}
      options={options}
      onChange={onChange}
    />
  );
};

export default Heading;
