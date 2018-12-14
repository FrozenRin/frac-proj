<template>
  <div>
    <div class="title">
      <h3>{{title}}</h3>
    </div>
    <div class="comments-box shadow-lg p-3 mb-5 bg-white rounded-0">
      <div class="comments-list">
        <ol>
          <li v-for="item in commentsList">
            {{item.comment}}
            <a
              href="#"
              class="badge badge-danger"
              @click.prevent="sendDeleteMessage(item.id)"
            >удалить</a>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Комментарий №1 - не удалится. Придет неверный ответ от сервера
 * Комментарий №2 - не удалится. Сервер не ответит
 */
export default {
  name: "comments",
  data() {
    return {
      title: "Комментарии",
      wsUrl: "ws://echo.websocket.org/",
      commentsList: [
        {
          id: 1,
          comment: "Тестовый коммент 1"
        },
        {
          id: 2,
          comment: "Это шедевр"
        },
        {
          id: 3,
          comment: "Это прекрасно"
        },
        {
          id: 4,
          comment: "Лучшее, что я видел"
        },
        {
          id: 5,
          comment: "Два чая этому автору"
        },
        {
          id: 6,
          comment: "Подстава 100%"
        },
        {
          id: 7,
          comment: "Чей это кот?"
        },
        {
          id: 8,
          comment: "Чья собака?"
        },
        {
          id: 9,
          comment: "Еще один коммент"
        },
        {
          id: 10,
          comment: "Скиньте трек пожалуйста!"
        }
      ],
      wrongId: 11, // Переменная с некорректным значением ID, для тестирования
      websocket: null,
      IdsList: [], // Список отправленных на удаление id комментариев
      timeOut: 10000 // Таймаут для ожидания ответа
    };
  },
  /**
   * Создаём объект WebSocket.
   *  onopen - вызывается когда соединение установлено
   *  onclose - вызывается когда соединение закрывается
   *  onmessage - вызывается когда браузер получает данные через веб-сокет
   *  onerror - вызывается при ошибках
   */
  mounted() {
    this.websocket = new WebSocket(this.wsUrl);
    this.websocket.onopen = e => console.log("Connected to WebSocket");
    this.websocket.onclose = e => console.log("Disconnected from WebSocket.");
    this.websocket.onmessage = e => this.wsMessage(e);
    this.websocket.onerror = e => console.log(e);
  },
  /**
   * Закрываем соединение при уходе с вкладки
   */
  destroyed() {
    this.websocket.close();
  },
  methods: {
    /**
     * Обрабатываем сообщения с сервера
     */
    wsMessage(e) {
      const wsAnswer = +e.data;
      const wsAnswerInIds = this.IdsList.indexOf(wsAnswer) !== -1; // Ищем id который вернул сервер в списке отправленных на удаление id
      if (wsAnswerInIds) {
        this.deleteComment(wsAnswer);
        this.deleteIdFromIdsList(wsAnswer);
      }
    },
    /**
     * Удаляем комментарий по id
     */
    deleteComment(id) {
      this.commentsList = this.commentsList.filter(item => item.id !== id);
    },

    /**
     * Удаляем id комментария из списка id отправленных на удаление комментариев
     */
    deleteIdFromIdsList(id) {
      this.IdsList = this.IdsList.filter(item => item !== id);
    },

    sendDeleteMessage(id) {
      // Помещаем id в наш список на удаление
      this.IdsList.push(id);
      // Тестируем комментарий с неправильным id
      if (id === 1) id = this.wrongId;
      // если id = 2, то не отсылаем запрос => Сервер не передаст ответ и комментарий не удалится
      if (id !== 2) {
        this.websocket.send(id);
      }
      // Задержка на удаление id из списка
      setTimeout(() => {
        this.deleteIdFromIdsList(id);
      }, this.timeOut);
    }
  }
};
</script>

<style scoped>
.comments-box {
  width: 40%;
  margin: 0 auto;
}

.comments-list {
  text-align: left;
  margin: 0 auto;
}

li {
  padding: 5px;
}
</style>
