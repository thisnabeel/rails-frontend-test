import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["field", "icon"];
  connect() {
    this.element[this.identifier] = this;
  }

  toggleCheckbox() {
    const currentVal = this.fieldTarget.getAttribute("value");
    const isChecked =
      currentVal === "true" || currentVal === 1 || currentVal === "1";

    this.iconTarget.classList.toggle("active", !isChecked);
    this.iconTarget.classList.toggle("inactive", isChecked);
    this.iconTarget.classList.toggle("fa-eye-slash", isChecked);
    this.iconTarget.classList.toggle("fa-eye", !isChecked);

    this.fieldTarget.setAttribute("value", isChecked ? 0 : 1);
  }
}
