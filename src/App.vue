<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <nav class="navbar navbar-expand-lg navbar-light bg-light col-12 text-center">
          <ul class="navbar-nav m-auto">
            <li class="nav-item">
              <router-link to="/Calc" class="nav-link">Калькулятор дробей</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Comments" class="nav-link">Комментарии</router-link>
            </li>
          </ul>
        </nav>
        <div class="list-group"></div>
        <div class="view-box col-12">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
}
.view-box {
  margin-top: 20px;
}
</style>
