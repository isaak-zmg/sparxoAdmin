import { observable, computed, action } from 'mobx';

class TestStore {
  @observable items = []

  @action loadData = () => {
    const res = [
      {
        email: {
          repEmail: "zhoumaoguo888@gmail.com"
        },
        id: 1
      },
      {
        email: null,
        id: 2
      }
    ]
    for (var i = 0; i < res.length; i++) {
      res[i].email = res[i].email != null ? res[i].email.repEmail : "null"
    }
    this.items = res;
  }

  @action delete = (recordID) => {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === recordID) {
        this.items[i].email = "null"
      }
    }
  }
}

export default TestStore