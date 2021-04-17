export default class Storage {
  static setClassStorage(cid, data) {
    let data_string = JSON.stringify(data);
    window.localStorage.setItem(cid, data_string);
  }
  static getClassStorage(cid) {
    let data_string = window.localStorage.getItem(cid);
    return JSON.parse(data_string);
  }
}
