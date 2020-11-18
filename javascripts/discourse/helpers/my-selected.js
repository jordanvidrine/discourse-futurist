import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("my-selected", (order, option) => {
  return order === option;
})