import Component from "@ember/component";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import DNavigation from 'discourse/components/d-navigation';

export default DNavigation.extend({
  tagName: "",
  router: service(),

  init() {
    this._super(...arguments);
  },

  @observes("filterMode")
  _updateBodyClasses() {
    console.log('should do something to the body classes');
  },

  @discourseComputed()
  homePageSetting() {
    return `discovery.${defaultHomepage()}`;
  },

  @discourseComputed("router.currentRoute")
  filterMode(currentRoute) {
    console.log('getting filterMode');
    return currentRoute.name.split(".")[1] || "latest";
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
