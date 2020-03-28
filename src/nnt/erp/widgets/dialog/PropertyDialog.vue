<template>
  <erp-dialog ref="dlg"
              :title="title"
              @open="$emit('open', $event)"
              @opened="$emit('opened', $event)"
              @cancel="$emit('cancel', $event)"
              @confirm="$emit('confirm', $event)"
              @close="$emit('close', $event)">
    <erp-propertyfrom :model="model.properties"></erp-propertyfrom>
  </erp-dialog>
</template>

<script lang="ts">

  import {PropertyDialog} from "../../../model/dialog/IPropertyDialog";

  export default {
    name: "PropertyDialog",
    props: {
      model: {
        type: Object,
        default: () => {
          return new PropertyDialog()
        }
      },
      title: {
        type: String
      }
    },
    methods: {
      show() {
        this.$refs.dlg.show()
      },
      cancel() {
        this.$refs.dlg.cancel()
      },
      confirm() {
        this.$refs.dlg.confirm()
      }
    }
  }
</script>
