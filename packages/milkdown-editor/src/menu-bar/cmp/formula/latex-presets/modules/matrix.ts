export default {
  key: 'Matrix',
  label: '矩阵',
  content: [
    //无括号
    {
      latex: '\\begin{matrix}{1}&{2}&{3}\\\\{4}&{5}&{6}\\end{matrix}',
    },
    //中括号
    {
      latex: '\\left[\\begin{matrix}{}&{}&{}\\\\{}&{}&{}\\end{matrix}\\right]',
    },
    //小括号
    {
      latex: '\\left(\\begin{matrix}{}&{}&{}\\\\{}&{}&{}\\end{matrix}\\right)',
    },
    //单竖线
    {
      latex: '\\left|\\begin{matrix}{}&{}&{}\\\\{}&{}&{}\\end{matrix}\\right|',
    },
    //双竖线
    {
      latex:
        '\\left||\\begin{matrix}{}&{}&{}\\\\{}&{}&{}\\end{matrix}\\right||',
    },
    //大括号
    {
      latex:
        '\\left\\{\\begin{matrix}{}&{}&{}\\\\{}&{}&{}\\end{matrix}\\right\\}',
    },
    //左大括号
    {
      latex:
        '\\left\\{\\begin{matrix}{}&{}&{}\\\\{}&{}&{}\\end{matrix}\\right.',
    },
    //右大括号
    {
      latex:
        '\\left.\\begin{matrix}{}&{}&{}\\\\{}&{}&{}\\end{matrix}\\right\\}',
    },
    //左大括号+文字
    {
      latex: '\\left\\{\\begin{matrix}if x=\\\\if x=\\end{matrix}\\right.',
    },
    //无大括号+文字
    {
      latex: '\\begin{matrix}y=1729x\\\\y=x\\end{matrix}',
    },
  ],
};
