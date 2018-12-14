<template>
  <div>
    <div class="title">
      <h3>{{title}}</h3>
    </div>
    <div class="fractions-list shadow-lg p-3 mb-5 bg-white rounded-0">
      <template v-for="(item, index) in fullInputString">
        <template v-if="item.type === 'operand'">
          <fraction
            :id="index"
            :isResult="item.isResult"
            :numenator="item.numenator"
            :denomenator="item.denomenator"
            @fraction-change="onChangeFractions"
          />
        </template>
        <template v-else-if="item.type === 'operation'">
          {{item.isResult}}
          <operation :id="index" :type="item.value" @changeOperation="onChangeOperation"/>
        </template>
        <template v-else-if="item.type === 'bracket'">
          <div class="brackets">
            <div class="bracket">
              <div class="bracket-view">{{ item.value }}</div>
            </div>
          </div>
        </template>
      </template>
      <hr>
      <p class="text-center">
        <b>Панель управления</b>
      </p>
      <button class="btn btn-primary rounded-0 mr-2" @click="addBracket()">Открыть скобку</button>
      <button class="btn btn-success rounded-0 mr-2" @click="addFraction">Добавить дробь</button>
      <button class="btn btn-primary rounded-0" @click="addBracket(true)">Закрыть скобку</button>
      <br>
      <button
        class="btn btn-danger rounded-0 mt-2"
        @click="inputString = []; resultString = []; initComponent()"
      >Сбросить</button>
      <hr>
      <div>
        <transition name="fade">
          <div v-if="showWarning">
            <span class="text-danger">
              <b>{{warningText}}</b>
            </span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * В задании использованы:
 * 1) Vue-bootstrap 4 - отвечает за оформление
 * 2) Math.js - отвечает за действия над дробями
 * 3) Постфиксная нотация(Обратная Польская) - имеет ряд преимуществ перед инфиксной записью при выражении алгебраических формул.
 *  - любая формула может быть выражена без скобок
 *  - удобна для вычисления формул в машинах со стеками
 */
import fraction from "../components/fraction.vue";
import operation from "../components/operation.vue";

import * as rpn from "../calculation/rpn";

export default {
  name: "calculator",
  data() {
    return {
      title: "Калькулятор дробей",
      inputString: [],
      resultString: [],
      showWarning: false,
      warningText: ""
    };
  },

  mounted() {
    this.initComponent();
  },

  computed: {
    fullInputString: function() {
      return this.inputString.concat(this.resultString);
    }
  },

  methods: {
    /** Текст ошибок */
    updateWarningText(code) {
      switch (code) {
        case 1:
          return (this.warningText = "Заполните все поля");
          break;
        case 2:
          return (this.warningText = "Не правильно расставлены скобки!");
          break;
        case 3:
          return (this.warningText = "Нет открытых скобок!");
          break;
        default:
          return (this.warningText = "Проверьте правильность выражения");
          break;
      }
    },

    /**Смена операции */
    onChangeOperation(e) {
      this.inputString[e.id].value = e.newOp;
      this.checkForUpdate();
    },

    /**Действие при изменении дроби */
    onChangeFractions(e) {
      if (e.part === "numenator") {
        this.inputString[e.id].numenator = e.newValue;
      } else if (e.part === "denomenator") {
        this.inputString[e.id].denomenator = e.newValue;
      }
      this.checkForUpdate();
    },

    /**Дробь */
    defaultFraction(isResult = false) {
      return {
        numenator: "",
        denomenator: "",
        type: "operand",
        isResult: isResult
      };
    },

    /**Операция */
    defaultOperation(op) {
      return {
        type: "operation",
        value: op
      };
    },

    /**Скобка */
    defaultBracket(brck) {
      return {
        type: "bracket",
        value: brck
      };
    },

    /**Добавить дробь */
    addFraction() {
      this.inputString.push(this.defaultOperation("+"));
      this.inputString.push(this.defaultFraction());
      this.checkForUpdate();
    },

    /**Добавить скобку */
    addBracket(isClose = false) {
      if (isClose) {
        const openBrackets = this.inputString.filter(
          item => item.value === "("
        );
        const closedBrackets = this.inputString.filter(
          item => item.value === ")"
        );
        if (openBrackets.length <= closedBrackets.length) {
          this.updateWarningText(3);
          this.showWarning = true;
        } else {
          this.inputString.push(this.defaultBracket(")"));
          this.checkForUpdate();
        }
      } else {
        this.inputString.push(this.defaultOperation("+"));
        this.inputString.push(this.defaultBracket("("));
        this.inputString.push(this.defaultFraction());
        this.checkForUpdate();
      }
    },

    /** Проверка скобок. Если число открытых != числу закрытых вернет false */
    checkBrackets() {
      const openBrackets = this.inputString.filter(item => item.value === "(");
      const closedBrackets = this.inputString.filter(
        item => item.value === ")"
      );
      if (openBrackets.length != closedBrackets.length) return false;
      else return true;
    },

    /** Проверка для пересчёта результата*/
    checkForUpdate() {
      const operands = this.inputString.filter(item => item.type === "operand");
      for (let i = 0; i < operands.length; i++) {
        let isFractionOk =
          !isNaN(operands[i].numenator) &&
          !isNaN(operands[i].denomenator) &&
          +operands[i].denomenator !== 0;
        if (!isFractionOk) {
          this.updateWarningText(1);
          this.reCalcResult();
          return;
        }
        if (i === operands.length - 1) {
          this.reCalcResult(false);
        }
      }
    },

    /** Пересчёт результата */
    reCalcResult(isReset = true) {
      this.showWarning = isReset;
      if (!isReset) {
        if (this.checkBrackets()) {
          const result = rpn.calculate(this.inputString);
          this.setResult(result.numenator, result.denomenator);
        } else {
          this.updateWarningText(2);
          this.showWarning = true;
        }
      } else {
        this.setResult();
      }
    },

    /** Установка результата */
    setResult(numenator = "", denomenator = "") {
      if (numenator !== "" && denomenator !== "" && numenator === denomenator) {
        numenator = 1;
        denomenator = 1;
      }
      this.resultString = this.resultString.map(item => {
        if (item.type === "operand") {
          item.numenator = numenator + "";
          item.denomenator = numenator !== 0 ? denomenator + "" : "0";
        }
        return item;
      });
    },

    /**Инициализация компонента */
    initComponent() {
      this.inputString.push(this.defaultFraction());
      this.resultString.push(this.defaultOperation("="));
      this.resultString.push(this.defaultFraction(true));
      this.checkForUpdate();
    }
  },

  components: {
    fraction,
    operation
  }
};
</script>

<style scoped>
.fractions-list {
  width: 80%;
  padding: 10px;
  margin: 10px auto;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.brackets {
  font-size: larger;
  width: 30px;
  height: 100px;
  display: inline-block;
  margin: 10px;
  position: relative;
}

.bracket {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 15px;
  line-height: 50px;
  font-size: 25pt;
}

.bracket-view {
  width: 30px;
  height: 70px;
  line-height: 65px;
  border: 1px solid #d2d2d2;
}
</style>