import Button from "./base/Button.vue";
import Input from "./base/Input.vue";
import Form from "./base/Form.vue";
import FormItem from "./base/FormItem.vue";
import Chart from "./chart/Chart.vue";
import Dialog from "./dialog/Dialog.vue";
import NavigationList from "./navigation/List.vue";
import PickerDropList from "./picker/DropList.vue";
import Tab from "./tab/Tab.vue";
import TableChangeColumn from "./table/ChangeColumn.vue";
import TablePagination from "./table/Pagination.vue";
import Table from "./table/Table.vue";

export default {
  install: (Vue) => {
    Vue.component('erp-button', Button);
    Vue.component('erp-input', Input);
    Vue.component('erp-form', Form);
    Vue.component('erp-form-item', FormItem);
    Vue.component('erp-chart', Chart);
    Vue.component('erp-dialog', Dialog);
    Vue.component('erp-navigation-list', NavigationList);
    Vue.component('erp-picker-droplist', PickerDropList);
    Vue.component('erp-tab', Tab);
    Vue.component('erp-table-changecolumn', TableChangeColumn);
    Vue.component('erp-table-pagination', TablePagination);
    Vue.component('erp-table', Table);
  }
}
