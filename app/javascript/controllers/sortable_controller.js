// app/javascript/controllers/sortable_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["item", "items"];
  static classes = ["dragging", "drop-target", "placeholder"];

  connect() {
    this.addDragListeners();
  }

  addDragListeners() {
    this.element.addEventListener("dragstart", this.handleDragStart.bind(this));
    this.element.addEventListener("dragover", this.handleDragOver.bind(this));
    this.element.addEventListener("dragleave", this.handleDragLeave.bind(this));
    this.element.addEventListener("drop", this.handleDrop.bind(this));
    this.element.addEventListener("dragend", this.handleDragEnd.bind(this));

    const listItems = this.element.querySelectorAll("li");

    listItems.forEach((target) => {
      target.setAttribute("draggable", true);
    });
  }

  handleDragStart(event) {
    const draggedItem = event.target;
    draggedItem.classList.add(this.draggingClass);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedItem.innerHTML);
  }

  handleDragOver(event) {
    event.preventDefault();
    const draggedItem = this.element.querySelector(`.${this.draggingClass}`);
    const listItems = Array.from(this.element.querySelectorAll("li"));
    const index = listItems.indexOf(draggedItem);

    console.log(index);
  }

  handleDragLeave(event) {
    // Add any handling for drag leave if needed
  }

  handleDrop(event) {
    event.preventDefault();
    const draggedItem = this.element.querySelector(`.${this.draggingClass}`);
    const dropTarget = event.target.closest("li");

    if (dropTarget) {
      dropTarget.insertAdjacentElement("beforebegin", draggedItem);
      this.removePlaceholder();
    }

    const reasons_order = [...this.currentList()].map((e) => e.dataset["id"]);
    console.log(reasons_order);

    fetch("/storefronts/1/save_draft", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/vnd.turbo-stream.html",
      },
      body: JSON.stringify({
        reasons_order: reasons_order,
        storefront_id: 1,
      }),
    })
      .then((r) => r.text()) // Read the body stream here
      .then((html) => {});
  }

  handleDragEnd(event) {
    const draggedItem = this.element.querySelector(`.${this.draggingClass}`);
    draggedItem.classList.remove(this.draggingClass);
  }

  removePlaceholder() {
    // Implement the logic to remove the placeholder if you have one
  }

  saveOrder() {
    const listItems = this.element.querySelectorAll("li");
    // console.log(listItems);
    const order = Array.from(listItems).map((item, index) => [
      item.getAttribute("data-id"),
      index,
    ]);
    console.log(order);
    // You can return or use the 'order' array as needed
  }

  currentList() {
    return this.element.querySelectorAll("[data-sortable-target]");
  }
}
