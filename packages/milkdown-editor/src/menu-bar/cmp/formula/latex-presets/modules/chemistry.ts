export default {
  key: 'chemistry',
  label: '化学',
  content: [
    {
      latex: '2H_2O_2',
      remark: '化学物质',
    },
    {
      latex: 'SO_4\\ ^{2-}+Ba^{2+}\\rightarrow BaSO_4\\downarrow',
      remark: '反应式',
    },
    {
      latex:
        'A\\downarrow \\ B\\downarrow\\  \\longrightarrow B\\uparrow \\ B\\uparrow',
      remark: '反应式',
    },
    {
      latex: '\\xrightarrow[170℃]{浓硫酸}', // mathquill不通用 \\xrightarrow{浓硫酸}{170℃} \\{170\\celsius}
      remark: '反应条件',
      mqNo: false,
    },
    {
      latex: '\\xlongequal[]{一定条件}', // mathquill不通用 \\xrightarrow{浓硫酸}{170\\celsius}
      remark: '反应条件',
      mqNo: true,
    },
    // {
    //   latex: "\\xleftrightharpoons[]{\\ 一定条件}", // mathquill不通用
    //   remark: "反应条件",
    //   mqNo: true
    // },
  ],
};
