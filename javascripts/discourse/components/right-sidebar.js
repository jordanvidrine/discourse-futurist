import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import DNavigation from 'discourse/components/d-navigation';

export default DNavigation.extend({
  tagName: "",
  router: service(),
  selectedTopics: [],

  init() {
    this._super(...arguments);
  },

  _isFilterPage(filter, filterType) {
    if (!filter) {
      return false;
    }
    return new RegExp(filterType + "$", "gi").test(filter);
  },

  @discourseComputed("router.currentRoute.attributes.category")
  category(currentCategory) {
    if (currentCategory) {
      return currentCategory;
    }
  },

  @discourseComputed("model.filter", "model.topics.length")
  showDismissRead(filter, topicsLength) {
    return this._isFilterPage(filter, "unread") && topicsLength > 0;
  },

  @discourseComputed("category.can_edit")
  showCategoryEdit: (canEdit) => canEdit,

  @discourseComputed("router.currentRoute.name")
  shouldShow(routeName) {
    return routeName === "discovery.latest" || "discovery.category" || "topic.fromParamsNear";
  },
  @discourseComputed("currentUser")
  canCreateTopic(currentUser) {
    if (!currentUser) return;
    return currentUser.can_create_topic;
  }
});
