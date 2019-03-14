
export const tmpl = (() => {
  let tmplEncodeReg = /[<>&"'\x00]/g
  let tmplEncodeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  }

  function compile (str: string) {
    return str.replace(/([\s'\\])(?![^%]*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g, function (s, p1, p2, p3, p4, p5) {
      if (p1) { // whitespace, quote and backspace in interpolation context
        return (<any>{
          '\n': '\\n',
          '\r': '\\r',
          '\t': '\\t',
          ' ': ' '
        })[s] || '\\' + s
      }
      if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
        if (p2 === '=') {
          return "'\r\n+slash(" + p3 + ")+'"
        }
        return "'\r\n+(" + p3 + ")+'"
      }
      if (p4) { // evaluation start tag: {%
        return "';\r\n"
      }
      if (p5) { // evaluation end tag: %}
        return "\r\n_tmp_+='"
      }
    })
  }

  function slash (s: string) {
    return String(s || '').replace(tmplEncodeReg, (c) => (<any>tmplEncodeMap)[c] || '')
  }

  let Func = Function

  return (str: string) => {
    let func = new Func('state, slash', "let _tmp_=''; {_tmp_='" +
      compile(str || '') + "';}\r\n return _tmp_")
    return (state?: object) => func(state, slash)
  }
})()
