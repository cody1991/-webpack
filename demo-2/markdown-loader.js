const marked = require('marked');
module.exports = (source) => {
  console.log(source);

  const html = marked(source);
  // const code = `export default ${JSON.stringify(html)}`;
  // return code;

  return html;
};
