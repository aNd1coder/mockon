/**
 * this file will be loaded before server started
 * you can register middleware
 * https://thinkjs.org/doc/middleware.html
 */

import cors from 'think-cors'

think.middleware('cors', cors)
think.middleware('get_lang', http => {
  let supportLangs = think.config('locale.support')
  let lang = http.pathname.split('/')[0] //从 URL 中获取语言

  if (supportLangs.indexOf(lang) > -1) {
    http.pathname = http.pathname.substr(lang.length + 1)
  } else {
    lang = http.lang() //从 cookie 或者 header 中获取语言
    if (supportLangs.indexOf(lang) === -1) {
      lang = http.config('locale.default') //默认支持的语言
    }
  }
  http.lang(lang, true) //设置语言，并设置模版路径中添加语言目录
})
