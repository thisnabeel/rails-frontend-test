import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["addItem", "template", "form"];
  static values = { index: String };

  publish_draft() {
    fetch("/storefronts/1/publish_draft")
      .then((data) => data.json()) // Read the body stream here
      .then((res) => {
        console.log(res);
        alert("Saved!");
      });
  }

  save_draft() {
    const serialized = this.serializeForm(this.formTarget);
    console.log({ serialized });

    const reasons_order = [...this.currentList()].map((e) => e.dataset["id"]);
    console.log(reasons_order);

    const modal = this.application.getControllerForElementAndIdentifier(
      this.element,
      "modal"
    );

    fetch("/storefronts/1/save_draft", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/vnd.turbo-stream.html",
      },
      body: JSON.stringify({
        reasons_order: reasons_order,
        reason: serialized,
      }),
    })
      .then((r) => r.text()) // Read the body stream here
      .then((html) => {
        Turbo.renderStreamMessage(html);
        modal.hide();
      });
  }

  serializeForm(form) {
    var formData = {};
    var inputs = form.querySelectorAll("input");

    let getKeyFromName = this.getKeyFromName;

    inputs.forEach(function (input) {
      var name = input.getAttribute("name");
      if (!name) return;
      var key = getKeyFromName(name);
      var value = input.value;
      formData[key] = value;
    });

    return formData;
  }

  getKeyFromName(name) {
    // Assuming the input name is in the format "reason[code]"
    var matches = name.match(/\[([^)]+)\]/);
    return matches ? matches[1] : name;
  }

  currentList() {
    const sortable = this.application.getControllerForElementAndIdentifier(
      this.element,
      "sortable"
    ).scope;
    return sortable.element.querySelectorAll("[data-sortable-target]");
  }
}
