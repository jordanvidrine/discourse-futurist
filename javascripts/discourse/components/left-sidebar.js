import Component from "@ember/component";
import discourseComputed, { observes, on } from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import FilterModeMixin from "discourse/mixins/filter-mode";
import DNavigation from 'discourse/components/d-navigation';

export default DNavigation.extend({
  tagName: "",
  router: service(),

  init() {
    this._super(...arguments);
  },

  @on("init")
  _addBodyClasses() {
    document.body.classList.add(this.filterMode)
  },

  willDestroyElement() {
    document.body.classList.remove(this.filterMode)
  },

  @discourseComputed()
  settingsLinks() {
    if (settings.links) {
      let links = settings.links.split(" | ").map(item => {
        return {
          title: item.split(",")[1],
          link: item.split(",")[0]
        }
      })
      return links;
    } else {
      return false;
    }
  },

  @discourseComputed()
  homePageSetting() {
    return `discovery.${defaultHomepage()}`;
  },

  @discourseComputed("router.currentRoute")
  filterMode(currentRoute) {
    return currentRoute.localName || "latest";
  },

  @discourseComputed("router.currentRoute.attributes.category")
  category(currentCategory) {
    if (currentCategory) {
      return currentCategory;
    }
  },

  @discourseComputed("site.categoriesList")
  categories(categoriesList) {
    return categoriesList;
  },

  @discourseComputed("router.currentRoute.name")
  shouldShow(routeName) {
    return routeName === "discovery.latest" || "discovery.category" || "topic.fromParamsNear";
  },

  @discourseComputed("router.currentRoute.name")
  isNotTopic(routeName) {
    if (routeName === undefined) {
      return false;
    } else {
      return routeName === "topic.fromParamsNear";
    }
  },

});
