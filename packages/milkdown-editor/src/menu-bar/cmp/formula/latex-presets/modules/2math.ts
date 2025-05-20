export default {
  key: 'math',
  label: '数学',
  content: [
    {
      latex: '\\overset{\\cdot}{x}', // mathQuill不支持
      remark: '循环小数',
    },
    {
      latex: '\\overset{\\cdot}{x}\\overset{\\cdot}{y}', // mathQuill不支持
      remark: '循环小数',
    },

    {
      latex: '\\frac{x}{y}',
      remark: '分数',
    },
    {
      latex: '\\sqrt{x}',
      remark: '根式',
    },
    {
      latex: '\\sqrt[a]{x}',
      remark: '根式',
    },
    {
      latex: 'x^{a}',
      remark: '上标',
    },
    {
      latex: 'x_{a}',
      remark: '下标',
    },
    {
      latex: 'x_{a}^{b}',
      remark: '角标',
    },
    {
      latex: '\\sin \\alpha',
      remark: '正弦函数',
    },
    {
      latex: '\\cos \\alpha',
      remark: '余弦函数',
    },
    {
      latex: '\\tan \\alpha',
      remark: '正切函数',
    },
    {
      latex: '\\sin^{-1} \\alpha',
      remark: '反正弦函数',
    },
    {
      latex: '\\cos^{-1} \\alpha',
      remark: '反余弦函数',
    },
    {
      latex: '\\tan^{-1} \\alpha',
      remark: '反正切函数',
    },
    {
      latex: '\\left({}\\right)',
      remark: '小括号',
    },
    {
      latex: '\\left|{}\\right|',
      remark: '绝对值',
    },
    {
      latex: "f'",
      remark: '导数',
    },
    {
      latex: "f''",
      remark: '导数',
    },
    {
      latex: '\\sqrt{a^{2}+b^{2}}',
      remark: '根号公式',
    },
    {
      latex: '\\sqrt{b^{2}-4ac}',
      remark: '根号公式',
    },
    {
      latex: 'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}',
      remark: '根号公式',
    },
    {
      latex: '\\sum_{k=1}^{n} k^2',
      remark: '求和',
    },
  ],
};
