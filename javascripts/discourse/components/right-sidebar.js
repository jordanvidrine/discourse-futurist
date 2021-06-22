import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import DNavigation from 'discourse/components/d-navigation';
import { ajax } from "discourse/lib/ajax";

export default DNavigation.extend({
  tagName: "",
  router: service(),
  pinnedTopics: [],
  groupMembers: [],

  init() {
    this._super(...arguments);

    ajax("/search?q=in:pinned")
    .then(data => {
      let pinnedTopics = [];
      data.topics.forEach(topic => {
        if (!topic.title.includes("About") && this.category && topic.category_id === this.category.id) {
          pinnedTopics.push(topic)
        }
      })
      this.set("pinnedTopics", pinnedTopics)
    })

    if (this.category) {
      let categoryGroup = this.category.name.replace(" ","");

      if (this.category.parentCategory) {
        categoryGroup = this.category.parentCategory.name.replace(" ","");
      }

      ajax(`/groups/${categoryGroup}`)
      .then((json) => {
        ajax(`/directory_items?period=all&order=username&group=${json.group.name}`)
        .then((json) => {
          this.set("groupMembers", json.directory_items.map(item => item.user))
        })
        .catch((e) => {
          console.log(e);
        })
      }).catch(() => {
        console.log(`${categoryGroup} is not a group.`);
      })
    }
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
