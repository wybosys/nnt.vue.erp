import Button from "./base/Button.vue";
import Input from "./base/Input.vue";
import Form from "./base/Form.vue";
import FormItem from "./base/FormItem.vue";

export default {
  install: (Vue) => {
    Vue.component('erp-button', Button)
    Vue.component('erp-input', Input)
    Vue.component('erp-form', Form)
    Vue.component('erp-form-item', FormItem)
  }
}
