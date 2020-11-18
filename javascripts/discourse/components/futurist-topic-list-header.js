import Component from "@ember/component";

export default Component.extend({
  tagName: "div",
  classNames: "futurist-topic-list-header",
  selectOptions: [
    {name:"activity", id:"activity", value: null},
    {name:"reply count", id:"post", value: null}
  ],
  order: null,

  init() {
    this._super(...arguments);
    if (this.order === undefined) {
      this.set("order", "activity");
    }
  }
})