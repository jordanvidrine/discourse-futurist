import MountWidget from "discourse/components/mount-widget";
import { observes } from "discourse-common/utils/decorators";

export default MountWidget.extend({
  widget: "floating-search-input",

  buildArgs() {

    return {
      shouldRender: true,
    };
  },

  @observes("currentPath")
  currentPathChanged() {
    this.rerenderWidget();
  }
});