import Component from "@ember/component";
import discourseComputed, {
  observes,
  on
} from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import FilterModeMixin from "discourse/mixins/filter-mode";
import DNavigation from "discourse/components/d-navigation";

export default DNavigation.extend({
  tagName: "",
  router: service(),
  addedClasses: [],

  init() {
    this._super(...arguments);
  },

  @on("init")
  _addBodyClasses() {
    document.body.classList.add(...this.bodyClasses);
    // store added classes to be removed on willDestroyElement
    // this is needed because this.bodyClasses will not return
    // the exact same list when called there versus called on Init
    this.set("addedClasses", [...this.bodyClasses]);
  },

  willDestroyElement() {
    document.body.classList.remove(...this.addedClasses);
  },

  @discourseComputed()
  settingsLinks() {
    if (settings.links) {
      let links = settings.links.split(" | ").map(item => {
        return {
          title: item.split(",")[1],
          link: item.split(",")[0]
        };
      });
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
  bodyClasses(currentRoute) {
    let classes = [];
    classes.push(this.filterMode);

    if (currentRoute.attributes && currentRoute.attributes.category) {
      if (currentRoute.attributes.category.has_children) {
        classes.push("parent-category");
      } else if (currentRoute.attributes.category.parent_category_id) {
        classes.push("child-category");
      } else {
        classes.push("standalone-category");
      }
    }

    return classes;
  },

  @discourseComputed("router.currentRoute")
  filterMode(currentRoute) {
    if (currentRoute.name.includes("Category")) {
      let name = currentRoute.name;
      name = name.replace("Category","")
      return name.replace("discovery.","");
    }
    return currentRoute.localName || "latest";
  },

  @discourseComputed("router.currentRoute.attributes.category")
  category(currentCategory) {
    if (currentCategory) {
      return currentCategory;
    } else {
      return null;
    }
  },

  @discourseComputed("site.categoriesList")
  categories(categoriesList) {
    return categoriesList;
  },

  @discourseComputed("router.currentRoute.name")
  shouldShow(routeName) {
    return (
      routeName === "discovery.latest" ||
      "discovery.category" ||
      "topic.fromParamsNear"
    );
  },

  @discourseComputed("router.currentRoute.name")
  isNotTopic(routeName) {
    if (routeName === undefined) {
      return false;
    } else {
      return routeName === "topic.fromParamsNear";
    }
  }
});
