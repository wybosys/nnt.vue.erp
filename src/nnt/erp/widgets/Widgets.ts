import Button from "./base/Button.vue";
import Input from "./base/Input.vue";
import PropertyEnumSelect from "./base/PropertyEnumSelect.vue";
import PropertyInput from "./base/PropertyInput.vue";
import ReadonlyCheckbox from "./base/ReadonlyCheckbox.vue";
import Select from "./base/Select.vue";
import Form from "./base/Form.vue";
import FormItem from "./base/FormItem.vue";
import PropertyForm from "./base/PropertyForm.vue";
import Chart from "./chart/Chart.vue";
import Dialog from "./dialog/Dialog.vue";
import PropertyDialog from "./dialog/PropertyDialog.vue";
import FilterInput from "./filter/Input.vue";
import FilterList from "./filter/List.vue";
import NavigationList from "./navigation/List.vue";
import PickerDropList from "./picker/DropList.vue";
import Tab from "./tab/Tab.vue";
import TableChangeColumn from "./table/ChangeColumn.vue";
import TablePagination from "./table/Pagination.vue";
import Table from "./table/Table.vue";
import PropertyGrid from "./table/PropertyGrid.vue";
import PropertyTable from "./table/PropertyTable.vue";

export default {
  install: (Vue) => {
    Vue.component('erp-button', Button);
    Vue.component('erp-select', Select);
    Vue.component('erp-input', Input);
    Vue.component('erp-input-property', PropertyInput);
    Vue.component('erp-checkbox-readonly', ReadonlyCheckbox);
    Vue.component('erp-property-enumselect', PropertyEnumSelect);
    Vue.component('erp-form', Form);
    Vue.component('erp-form-item', FormItem);
    Vue.component('erp-propertyfrom', PropertyForm);
    Vue.component('erp-chart', Chart);
    Vue.component('erp-dialog', Dialog);
    Vue.component('erp-propertydialog', PropertyDialog);
    Vue.component('erp-filter-input', FilterInput);
    Vue.component('erp-filter-list', FilterList);
    Vue.component('erp-navigation-list', NavigationList);
    Vue.component('erp-picker-droplist', PickerDropList);
    Vue.component('erp-tab', Tab);
    Vue.component('erp-table-changecolumn', TableChangeColumn);
    Vue.component('erp-table-pagination', TablePagination);
    Vue.component('erp-table', Table);
    Vue.component('erp-propertygrid', PropertyGrid);
    Vue.component('erp-propertytable', PropertyTable);
  }
}
