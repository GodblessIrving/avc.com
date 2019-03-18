import Vue from 'vue'
import zh_CN from 'vee-validate/dist/locale/zh_CN';
import VeeValidate,{ Validator } from 'vee-validate'

const config = {
  errorBagName: 'errors', // change if property conflicts
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  classes: false,
  classNames: {
  touched: 'touched', // the control has been blurred
  untouched: 'untouched', // the control hasn't been blurred
  valid: 'valid', // model is valid
  invalid: 'invalid', // model is invalid
  pristine: 'pristine', // control has not been interacted with
  dirty: 'dirty' // control has been interacted with
  },
  events: 'blur',
  inject: true,
  validity: false,
  aria: true,
  i18n: null, // the vue-i18n plugin instance
  i18nRootKey: 'validations' // the nested key under which the validation messsages will be located
};

Vue.use(VeeValidate, config);

//配置中文
Validator.localize('zh_CN',zh_CN);

//修改默认的错误提示信息
const dictionary = {
  zh_CN: {
    messages: {
      alpha_num : (field) =>field+' 只允许输入字母及数字.',
      not_in:(field)=>'请选择 '+field+'.',
      required:(field)=>field+'不能为空',
      numeric:(field)=>field+'只允许输入数字'
    },
  }
};
Validator.localize(dictionary);

//自定义规则 
Validator.extend('acc', {
  getMessage(field,args){
    return field+ ' 只允许输入字母、数字、下划线及·'
  },
  validate(value,args){
    return /^[0-9a-zA-Z_/·]+$/.test(value)
  }
});
Validator.extend('realname', {
  getMessage(field,args){
    return field+ ' 只允许输入字母、汉字、下划线及·'
  },
  validate(value,args){
    return /^[\u4e00-\u9fa5_a-zA-Z·]+$/.test(value)
  }
});
Validator.extend('mail', {
  getMessage(field,args){
    return field+ '必须是有效的地址'
  },
  validate(value,args){
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
  }
});
Validator.extend('hotnumber', {
  getMessage(field,args){
    return field+ '必须是正整数'
  },
  validate(value,args){
    return /^[0-9]+$/.test(value)
  }
});
