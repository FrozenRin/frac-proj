<template>
  <div class="operation">
    <div class="operator">
      <template v-if="isEqual">=</template>
      <template v-else>
        <div
          v-if="!showSelect"
          class="pointer operator-selected"
          @click="showSelect = !showSelect"
        >{{currentOperation}}</div>
        <div v-else class="pointer change-operator" @click="showSelect = !showSelect">
          <div class="op plus" @click="updateOperation('+')">+</div>
          <div class="op minus" @click="updateOperation('-')">-</div>
          <div class="op mult" @click="updateOperation('*')">*</div>
          <div class="op divide" @click="updateOperation('/')">/</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "operation",
  data() {
    return {
      showSelect: false,
      currentOperation: "+"
    };
  },
  computed: {
    isEqual: function() {
      return this.type === "=";
    }
  },
  props: ["type", "id"],
  mounted() {},
  methods: {
    updateOperation(op) {
      if (this.currentOperation === op) return;
      this.currentOperation = op;
      this.$emit("changeOperation", { id: this.id, newOp: op });
    }
  }
};
</script>

<style scoped>
.operation {
  font-size: larger;
  width: 50px;
  height: 100px;
  display: inline-block;
  margin: 10px;
  position: relative;
}

.operator {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 25px;
  line-height: 50px;
  font-size: 25pt;
}

.operator-selected {
  width: 50px;
  height: 50px;
  border: 1px solid #d2d2d2;
}

.change-operator {
  width: 80px;
  height: 80px;
  margin-left: -15px;
  margin-top: -15px;
  position: absolute;
}

.pointer {
  cursor: pointer;
}

.op {
  width: 35px;
  height: 35px;
  position: absolute;
  line-height: 35px;
  border: 1px solid #d2d2d2;
}

.plus {
  right: 0;
  top: 0;
}

.minus {
  right: 0;
  bottom: 0;
}

.mult {
  left: 0;
  top: 0;
}

.divide {
  left: 0;
  bottom: 0;
}
</style>
