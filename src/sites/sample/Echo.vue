<template>
  <div>
    <input v-model="input"></input>
    <button v-on:click="actEcho">echo</button>
    <label>{{output}}</label>
  </div>
</template>

<script lang="ts">
import {RestSession} from "../../nnt/core/RestSession";
import {SampleEcho} from "../../api/framework-nntlogic-apis.ts";

export default {
  name: "Echo",
  data() {
    return {
      input: '',
      output: ''
    }
  },
  methods: {
    actEcho() {
      let m = SampleEcho()
      m.input = this.input
      RestSession.fetch(m, () => {
        this.output = m.output
      })
    }
  }
}
</script>
