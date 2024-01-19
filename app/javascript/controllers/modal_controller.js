import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["modal"];

  connect() {
    this.element[this.identifier] = this;
  }

  hide() {
    this.modalTarget.classList.add("hidden");
  }
}
