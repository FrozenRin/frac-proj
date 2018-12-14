<template>
  <div class="fraction">
    <div class="numinator">
      <input
        v-model="currentNumenator"
        class="form-control rounded-0 fraction-input"
        :disabled="isResult"
        @input="onInput('numenator')"
      >
    </div>
    <div class="denominator">
      <input
        v-model="currentDenomenator"
        class="form-control rounded-0 fraction-input"
        :disabled="isResult"
        @input="onInput('denomenator')"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "fraction",
  data() {
    return {
      currentNumenator: "",
      currentDenomenator: ""
    };
  },
  watch: {
    numenator: function() {
      !isNaN(this.numenator)
        ? (this.currentNumenator = this.numenator)
        : (this.currentNumenator = "");
    },
    denomenator: function() {
      !isNaN(this.denomenator)
        ? (this.currentDenomenator = this.denomenator)
        : (this.currentDenomenator = "");
    }
  },
  mounted() {
    this.currentNumenator = this.numenator;
    this.currentDenomenator = this.denomenator;
  },
  props: {
    numenator: String,
    denomenator: String,
    isResult: Boolean,
    id: Number
  },
  methods: {
    onInput(part) {
      if (!this.isResult) {
        let payload = {
          id: this.id,
          part: part,
          newValue:
            part === "numenator"
              ? this.currentNumenator
              : this.currentDenomenator
        };
        this.$emit("fraction-change", payload);
      }
    }
  }
};
</script>

<style scoped>
.fraction {
  width: 50px;
  height: 100px;
  display: inline-block;
  margin: 10px;
  position: relative;
}

.numinator {
  width: 50px;
  height: 50px;
  position: absolute;
  line-height: 50px;
  font-size: 25pt;
  border-bottom: 1px solid #d2d2d2;
}

.denominator {
  width: 50px;
  height: 50px;
  position: absolute;
  line-height: 50px;
  font-size: 25pt;
  bottom: -3px;
}

.fraction-input {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 3px;
  top: 2px;
  font-weight: 700;
  font-size: 13pt;
  text-align: center;
  border: 1px solid #d2d2d2;
  padding: 0;
}
</style>
